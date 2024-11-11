const lib = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const { maxChecks } = require('../../helpers/environments');
const tokenHandler = require('./tokenHandler');

const handle = {};

handle.checkHandler = (req, callback) => {
  const acceptedMethod = ['get', 'post', 'put', 'delete'];
  if (acceptedMethod.includes(req.method)) {
    handle.check[req.method](req, callback);
  } else {
    callback(405);
  }
};

handle.check = {};

handle.check.get = (req, callback) => {
  const checkId = typeof req.queryStringObj.checkId === 'string'
  && req.queryStringObj.checkId.trim().length === 20 ? req.queryStringObj.checkId : false;

  if (checkId) {
    lib.read('checks', checkId, (readCheckErr, checkData) => {
      if (!readCheckErr) {
        const checkObj = parseJSON(checkData);

        const token = typeof req.headersObj.token === 'string'
                && req.headersObj.token?.trim().length === 20 ? req.headersObj.token : false;

        if (token) {
          tokenHandler.token.verify(token, checkObj.phone, (valid) => {
            if (valid) {
              callback(200, checkObj);
            } else {
              callback(401, {
                error: 'Authorization failed',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Invalid token',
          });
        }
      } else {
        callback(500, {
          error: 'Checks: Internal server error',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Invalid check id',
    });
  }
};

handle.check.post = (req, callback) => {
  const protocal = typeof req.body.protocal === 'string' && ['http', 'https'].includes(req.body.protocal)
    ? req.body.protocal
    : false;

  const url = typeof req.body.url === 'string' && req.body.url.trim().length ? req.body.url : false;

  const method = typeof req.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].includes(req.body.method) ? req.body.method : false;

  const successCode = typeof req.body.successCode === 'object' && Array.isArray(req.body.successCode)
    ? req.body.successCode
    : false;

  const timeoutSeconds = typeof req.body.timeoutSeconds === 'number'
  && req.body.timeoutSeconds % 1 === 0
    && req.body.timeoutSeconds >= 1
    && req.body.timeoutSeconds <= 5
    ? req.body.timeoutSeconds
    : false;

  if (protocal && url && method && successCode && timeoutSeconds) {
    const token = typeof req.headersObj.token === 'string' ? req.headersObj.token : false;

    lib.read('token', token, (readTokenErr, tokenData) => {
      const tokenObj = parseJSON(tokenData);
      if (!readTokenErr) {
        tokenHandler.token.verify(token, tokenObj.phone, (valid) => {
          if (valid) {
            lib.read('users', tokenObj.phone, (readUserErr, userData) => {
              if (!readUserErr) {
                const userObj = parseJSON(userData);

                const userChecks = typeof userObj.checks === 'object'
                && Array.isArray(userObj.checks) ? userObj.checks : [];

                if (userChecks.length <= maxChecks) {
                  const checkId = createRandomString(20);

                  const checkObj = {
                    checkId,
                    protocal,
                    url,
                    method,
                    successCode,
                    timeoutSeconds,
                    phone: userObj.phone,
                  };

                  lib.create('checks', checkId, checkObj, (createCheckErr) => {
                    if (!createCheckErr) {
                      userObj.checks = userChecks;
                      userObj.checks.push(checkId);

                      lib.update(
                        'users',
                        userObj.phone,
                        userObj,
                        (updateUserErr) => {
                          if (!updateUserErr) {
                            callback(200, checkObj);
                          } else {
                            callback(500, {
                              error: 'Internal server error',
                            });
                          }
                        },
                      );
                    } else {
                      callback(500, {
                        error: 'Checks: Internal server error',
                      });
                    }
                  });
                }
              } else {
                callback(404, {
                  error: 'user not found',
                });
              }
            });
          } else {
            callback(401, {
              error: 'Authorization failed',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Invalid token',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is something wrong with the request',
    });
  }
};

handle.check.put = (req, callback) => {
  const checkId = typeof req.body.checkId === 'string' && req.body.checkId.trim().length === 20
    ? req.body.checkId
    : false;

  const protocal = typeof req.body.protocal === 'string' && ['http', 'https'].includes(req.body.protocal)
    ? req.body.protocal
    : false;

  const url = typeof req.body.url === 'string' && req.body.url.trim().length ? req.body.url : false;

  const method = typeof req.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].includes(req.body.method) ? req.body.method : false;

  const successCode = typeof req.body.successCode === 'object' && Array.isArray(req.body.successCode)
    ? req.body.successCode
    : false;

  const timeoutSeconds = typeof req.body.timeoutSeconds === 'number' && req.body.timeoutSeconds % 1 === 0
  && req.body.timeoutSeconds >= 1 && req.body.timeoutSeconds <= 5 ? req.body.timeoutSeconds : false;

  if (checkId) {
    if (protocal || url || method || successCode || timeoutSeconds) {
      lib.read('checks', checkId, (readCheckErr, checkData) => {
        if (!readCheckErr) {
          const checkObj = parseJSON(checkData);

          const token = typeof req.headersObj.token === 'string'
                    && req.headersObj.token?.trim().length === 20 ? req.headersObj.token : false;

          if (token) {
            tokenHandler.token.verify(token, checkObj.phone, (valid) => {
              if (valid) {
                if (protocal) {
                  checkObj.protocal = protocal;
                }
                if (url) {
                  checkObj.url = url;
                }
                if (method) {
                  checkObj.method = method;
                }
                if (successCode) {
                  checkObj.successCode = successCode;
                }
                if (timeoutSeconds) {
                  checkObj.timeoutSeconds = timeoutSeconds;
                }

                lib.update('checks', checkId, checkObj, (updateCheckErr) => {
                  if (!updateCheckErr) {
                    callback(200, {
                      message: 'Updated successfully',
                    });
                  } else {
                    callback(500, {
                      error: 'There was a server side error!',
                    });
                  }
                });
              } else {
                callback(401, {
                  error: 'Authorization failed',
                });
              }
            });
          } else {
            callback(400, {
              error: 'Invalid token',
            });
          }
        } else {
          callback(404, {
            error: "Id couldn't found",
          });
        }
      });
    } else {
      callback(400, {
        error: 'You must provide at least one field to update!',
      });
    }
  } else {
    callback(400, {
      error: 'There is something wrong with the request',
    });
  }
};

handle.check.delete = (req, callback) => {
  const checkId = typeof req.queryStringObj.checkId === 'string'
  && req.queryStringObj.checkId.trim().length === 20 ? req.queryStringObj.checkId : false;

  if (checkId) {
    lib.read('checks', checkId, (readCheckErr, checkData) => {
      if (!readCheckErr) {
        const checkObj = parseJSON(checkData);

        const token = typeof req.headersObj.token === 'string'
                && req.headersObj.token?.trim().length === 20 ? req.headersObj.token : false;

        if (token) {
          tokenHandler.token.verify(token, checkObj.phone, (valid) => {
            if (valid) {
              lib.delete('checks', checkId, (deleteCheckErr) => {
                if (!deleteCheckErr) {
                  lib.read('users', parseJSON(checkData).phone, (readUserErr, userData) => {
                    const userObj = parseJSON(userData);
                    if (!readUserErr && userData) {
                      const userChecks = typeof userObj.checks === 'object'
                                    && userObj.checks instanceof Array
                        ? userObj.checks
                        : [];

                      const checkPosition = userChecks.indexOf(checkId);

                      if (checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        userObj.checks = userChecks;
                        lib.update('users', userObj.phone, userObj, (updateUserErr) => {
                          if (!updateUserErr) {
                            callback(200, {
                              message: 'Deleted successfully',
                            });
                          } else {
                            callback(500, {
                              error: 'There was a server side problem!',
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          error: 'The check id that you are trying to remove is not found in user!',
                        });
                      }
                    } else {
                      callback(500, {
                        error: 'There was a server side problem!',
                      });
                    }
                  });
                } else {
                  callback(500, {
                    error: 'There was a server side problem!',
                  });
                }
              });
            } else {
              callback(401, {
                error: 'Authorization failed',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Invalid token',
          });
        }
      } else {
        callback(404, {
          error: "Id couldn't found",
        });
      }
    });
  } else {
    callback(400, {
      error: 'Invalid check id',
    });
  }
};

module.exports = handle;
