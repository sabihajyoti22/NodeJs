const handle = {};

handle.sampleHandler = (req, callback) => {
    console.log(req);
    callback(200, {
        message: 'This is a sample URL',
    });
};

module.exports = handle;
