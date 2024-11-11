const lib = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

const handle = {};

handle.tokenHandler = (req, callback) => {
  const acceptedMethod = ['get', 'post', 'put', 'delete'];
  if (acceptedMethod.includes(req.method)) {
    handle.token[req.method](req, callback);
  } else {
    callback(405);
  }
};

handle.token = {};

handle.token.get = (req, callback) => {
  const id = typeof req.queryStringObj.id === 'string' && req.queryStringObj.id.trim().length === 20
    ? req.queryStringObj.id
    : false;

  if (id) {
    lib.read('token', id, (readErr, data) => {
      const token = { ...parseJSON(data) };
      if (!readErr) {
        callback(200, token);
      } else {
        callback(404, {
          error: 'User not found',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Not a valid token id',
    });
  }
};

handle.token.post = (req, callback) => {
  const phone = typeof req.body.phone === 'string' && req.body.phone.trim().length === 11
    ? req.body.phone
    : false;
  const password = typeof req.body.password === 'string' && req.body.password.trim().length
    ? req.body.password
    : false;

  if (phone && password) {
    lib.read('users', phone, (readErr, data) => {
      if (!readErr) {
        const hashPassword = hash(password);
        if (hashPassword === parseJSON(data).password) {
          const tokenID = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObj = {
            phone,
            tokenID,
            expires,
          };

          lib.create('token', tokenID, tokenObj, (createErr) => {
            if (!createErr) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                error: 'Some error has occured in server side',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Invalid password',
          });
        }
      } else {
        callback(404, {
          error: 'User not found',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is something wrong with the request',
    });
  }
};

handle.token.put = (req, callback) => {
  const id = typeof req.body.id === 'string' && req.body.id.trim().length === 20 ? req.body.id : false;

  const extend = !!(typeof req.body.extend === 'boolean' && req.body.extend === true);

  if (id && extend) {
    lib.read('token', id, (readErr, data) => {
      const tokenObj = parseJSON(data);
      if (!readErr) {
        tokenObj.expires = Date.now() + 60 * 60 * 1000;

        lib.update('token', id, tokenObj, (updateErr) => {
          if (!updateErr) {
            callback(200, {
              message: 'Update successfully',
            });
          } else {
            callback(500, {
              error: 'Internal server error',
            });
          }
        });
      } else {
        callback(500, {
          error: 'Internal server error',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is something wrong with the request',
    });
  }
};

handle.token.delete = (req, callback) => {
  const id = typeof req.queryStringObj.id === 'string' ? req.queryStringObj.id : false;

  if (id) {
    lib.read('token', id, (readErr) => {
      if (!readErr) {
        lib.delete('token', id, (deleteErr) => {
          if (!deleteErr) {
            callback(200, {
              message: 'Deleted successfully',
            });
          } else {
            callback(500, {
              error: 'Internal server error',
            });
          }
        });
      } else {
        callback(404, {
          error: 'Token not found',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is something wrong with the request',
    });
  }
};

handle.token.verify = (id, phone, callback) => {
  lib.read('token', id, (readErr, data) => {
    if (!readErr) {
      const tokenObj = parseJSON(data);
      if (tokenObj.phone === phone && tokenObj.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handle;
