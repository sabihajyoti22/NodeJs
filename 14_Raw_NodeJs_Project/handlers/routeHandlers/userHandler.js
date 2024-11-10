const lib = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

const handle = {};

handle.userHandler = (req, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.includes(req.method)) {
        handle._user[req.method](req, callback);
    } else {
        callback(405);
    }
};

handle._user = {};

handle._user.get = (req, callback) => {
    const phone =
        typeof req.queryStringObj.phone === 'string'
        && req.queryStringObj.phone.trim().length === 11
            ? req.queryStringObj.phone
            : false;
    if (phone) {
        const token =
            typeof req.headersObj.token === 'string' && req.headersObj.token?.trim().length === 20
                ? req.headersObj.token
                : false;
        if (token) {
            tokenHandler._token.verify(token, phone, (valid) => {
                if (valid) {
                    lib.read('users', phone, (readErr, data) => {
                        const user = { ...parseJSON(data) };
                        delete user.password;
                        if (!readErr) {
                            callback(200, user);
                        } else {
                            callback(404, {
                                error: 'User not found',
                            });
                        }
                    });
                } else {
                    callback(403, {
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
        callback(400, {
            error: 'Not a valid phone number',
        });
    }
};

handle._user.post = (req, callback) => {
    const firstname =
        typeof req.body.firstname === 'string' && req.body.firstname.trim().length
            ? req.body.firstname
            : false;
    const lastname =
        typeof req.body.lastname === 'string' && req.body.lastname.trim().length
            ? req.body.lastname
            : false;
    const phone =
        typeof req.body.phone === 'string' && req.body.phone.trim().length === 11
            ? req.body.phone
            : false;
    const password =
        typeof req.body.password === 'string' && req.body.password.trim().length
            ? req.body.password
            : false;
    const tosAgreement =
        typeof req.body.tosAgreement === 'boolean' && req.body.tosAgreement
            ? req.body.tosAgreement
            : false;

    if (firstname && lastname && phone && password && tosAgreement) {
        lib.read('users', phone, (readErr) => {
            if (readErr) {
                const userObj = {
                    firstname,
                    lastname,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                lib.create('users', phone, userObj, (createErr) => {
                    if (!createErr) {
                        callback(200, {
                            message: 'User created',
                        });
                    } else {
                        callback(500, {
                            error: "Couldn't create user",
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was an error in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem with the request',
        });
    }
};

handle._user.put = (req, callback) => {
    const firstname =
        typeof req.body.firstname === 'string' && req.body.firstname.trim().length
            ? req.body.firstname
            : false;
    const lastname =
        typeof req.body.lastname === 'string' && req.body.lastname.trim().length
            ? req.body.lastname
            : false;
    const phone =
        typeof req.body.phone === 'string' && req.body.phone.trim().length === 11
            ? req.body.phone
            : false;
    const password =
        typeof req.body.password === 'string' && req.body.password.trim().length
            ? req.body.password
            : false;
    if (phone) {
        if (firstname || lastname || password) {
            const token =
                typeof req.headersObj.token === 'string'
                && req.headersObj.token?.trim().length === 20
                    ? req.headersObj.token
                    : false;

            if (token) {
                tokenHandler._token.verify(token, phone, (valid) => {
                    if (valid) {
                        lib.read('users', phone, (readErr, data) => {
                            if (!readErr && data) {
                                const userData = { ...parseJSON(data) };
                                if (firstname) {
                                    userData.firstname = firstname;
                                }
                                if (lastname) {
                                    userData.lastname = lastname;
                                }
                                if (password) {
                                    userData.password = hash(password);
                                }

                                lib.update('users', phone, userData, (updateErr) => {
                                    if (!updateErr) {
                                        callback(200, {
                                            message: 'Successfully update the user',
                                        });
                                    } else {
                                        callback(500, {
                                            error: 'There was an error in server side',
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'There was an error in server side',
                                });
                            }
                        });
                    } else {
                        callback(403, {
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
            callback(400, {
                error: 'You have a problem with the request',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number',
        });
    }
};

handle._user.delete = (req, callback) => {
    const phone =
        typeof req.queryStringObj.phone === 'string'
        && req.queryStringObj.phone.trim().length === 11
            ? req.queryStringObj.phone
            : false;
    if (phone) {
        const token =
            typeof req.headersObj.token === 'string' && req.headersObj.token?.trim().length === 20
                ? req.headersObj.token
                : false;
        if (token) {
            tokenHandler._token.verify(token, phone, (valid) => {
                if (valid) {
                    lib.read('users', phone, (readErr, data) => {
                        if (!readErr && data) {
                            lib.delete('users', phone, (deleteErr) => {
                                if (!deleteErr) {
                                    callback(200, {
                                        message: 'Deleted successfully',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was an error in server side',
                                    });
                                }
                            });
                        }
                    });
                } else {
                    callback(403, {
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
        callback(400, {
            error: 'Invalid phone number',
        });
    }
};

module.exports = handle;
