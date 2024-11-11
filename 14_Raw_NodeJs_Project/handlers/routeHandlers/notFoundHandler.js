const handle = {};

handle.notFoundHandler = (req, callback) => {
  callback(404, {
    message: 'Your requested URL was not found',
  });
};

module.exports = handle;
