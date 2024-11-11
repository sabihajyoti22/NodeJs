const http = require('http');
const https = require('https');
const url = require('url');
const lib = require('./data');
const { parseJSON } = require('../helpers/utilities');

const worker = {};

worker.processCheckOutcome = (checkObj, checkOutCome) => {
  const checkData = checkObj;
  const state = !checkOutCome.error && checkOutCome.responseCode && checkData.successCode.includes(checkOutCome.responseCode) ? 'up' : 'down';

  const alertWanted = !!(checkData.lastChecked && checkData.state !== state);

  checkData.state = state;
  checkData.lastChecked = Date.now();

  lib.update('checks', checkData.checkId, checkData, (updateErr) => {
    if (!updateErr) {
      if (alertWanted) {
        const msg = `Alert: Your check for ${checkData.method.toUpperCase()} ${checkData.protocal}://${checkData.url} is currently ${checkData.state}`;

        console.log(`User was alerted to a status change via SMS: ${msg}`);
      } else {
        console.log('Alert is not needed as there is no state change!');
      }
    } else {
      console.log('Error trying to save check data of one of the checks!');
    }
  });
};

worker.performCheck = (checkObj) => {
  const checkData = checkObj;
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  let outcomeSent = false;

  const parsedUrl = url.parse(`${checkData.protocal}://${checkData.url}`, true);
  const hostName = parsedUrl.hostname;
  const { path } = parsedUrl;

  const protocalToUse = checkData.protocal === 'http' ? http : https;
  const requestDetails = {
    protocal: checkData.protocal,
    hostname: hostName,
    method: checkData.method,
    path,
    timeout: checkData.timeoutSeconds * 1000,
  };

  const req = protocalToUse.request(requestDetails, (res) => {
    checkOutCome.responseCode = res.statusCode;

    if (!outcomeSent) {
      outcomeSent = true;
      worker.processCheckOutcome(checkData, checkOutCome);
    }
  });

  req.on('error', (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      outcomeSent = true;
    }
  });

  req.on('timeout', () => {
    checkOutCome = {
      error: true,
      value: 'timeout',
    };
    if (!outcomeSent) {
      outcomeSent = true;
    }
  });

  req.end();
};

worker.validateCheckData = (checkObj) => {
  const checkData = checkObj;

  if (checkData && checkData.checkId) {
    checkData.state = typeof checkData.state === 'string' && ['up', 'down'].includes(checkData.state) ? checkData.state : 'down';

    checkData.lastChecked = typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

    worker.performCheck(checkObj);
  } else {
    console.log('Error: check was invalid or not properly formatted!');
  }
};

worker.gatherAllChecks = () => {
  lib.list('checks', (listErr, listData) => {
    if (!listErr && listData && listData.length) {
      listData.forEach((check) => {
        lib.read('checks', check, (readErr, checkData) => {
          if (!readErr) {
            worker.validateCheckData(parseJSON(checkData));
          } else {
            console.log('Error: reading one of the checks data!');
          }
        });
      });
    } else {
      console.log('Error: could not find any checks to process!');
    }
  });

  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};

worker.init = () => {
  worker.gatherAllChecks();
  console.log('Wroker is running');
};

module.exports = worker;
