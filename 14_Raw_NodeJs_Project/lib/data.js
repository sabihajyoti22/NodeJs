const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseURL = path.join(`${__dirname}/../.data/`);

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseURL + dir}/${file}.json`, 'wx', (errFileOpen, fileDescriptor) => {
    if (!errFileOpen && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, (errFileWrite) => {
        if (!errFileWrite) {
          fs.close(fileDescriptor, (errFileClose) => {
            if (!errFileClose) {
              callback(false);
            } else {
              callback('Error closing the new file!');
            }
          });
        } else {
          callback('Error writing to new file!');
        }
      });
    } else {
      callback('There was an error, file may already exists!');
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseURL + dir}/${file}.json`, 'utf8', (errFileRead, data) => {
    if (!errFileRead) {
      callback(errFileRead, data);
    } else {
      callback("Couldn't read the file");
    }
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseURL + dir}/${file}.json`, 'r+', (errFileOpen, fileDescriptor) => {
    if (!errFileOpen && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.ftruncate(fileDescriptor, (errFileTruncate) => {
        if (!errFileTruncate) {
          fs.writeFile(fileDescriptor, stringData, (errFileWrite) => {
            if (!errFileWrite) {
              fs.close(fileDescriptor, (errFileClose) => {
                if (!errFileClose) {
                  callback(false);
                } else {
                  callback('Error closing the new file!');
                }
              });
            } else {
              callback('Error writing to new file!');
            }
          });
        } else {
          callback('Error truncating file!');
        }
      });
    } else {
      callback('There was an error, file may already exists!');
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseURL + dir}/${file}.json`, (errFileDelete) => {
    if (!errFileDelete) {
      callback(false);
    } else {
      callback("Couldn't delete the file");
    }
  });
};

module.exports = lib;
