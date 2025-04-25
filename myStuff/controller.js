const getAsset = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Gotten!',
  });
};

module.exports = getAsset;