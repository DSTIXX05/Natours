const crypto = require('crypto');
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line node/no-extraneous-require
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// eslint-disable-next-line node/no-extraneous-require, import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line node/no-extraneous-require
const validator = require('validator');

// eslint-disable-next-line no-undef
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {})
  .catch((err) => console.log('DB connection error:', err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
  },
  password: {
    type: String,
    require: [true, 'Please provide a password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      //Only works with save
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password wasn't modified
  if (!this.isModified('password')) return next();
  //Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Password checker
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    ); //Because the time is in milliseconds.

    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //Because time is in milliseconds here.

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
