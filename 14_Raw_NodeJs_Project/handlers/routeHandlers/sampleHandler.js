const handle = {};

handle.sampleHandler = (req, callback) => {
  callback(200, {
    message: 'This is a sample URL',
  });
};

module.exports = handle;
