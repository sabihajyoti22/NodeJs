const crypto = require('crypto');
const environments = require('./environments');

const utlities = {};

utlities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

utlities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

utlities.createRandomString = (strLength) => {
    let output = '';

    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';

    for (let i = 1; i <= strLength; i += 1) {
        output += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return output;
};

module.exports = utlities;
