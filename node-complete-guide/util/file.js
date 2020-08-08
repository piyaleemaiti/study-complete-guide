const fs = require('fs');
const { deleteOne } = require('../models/order');

const deleteFile = (filePath) => {
  try {
    if(fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw (err);
        }
      });
    }
  } catch(err) {
    throw (err);
  }
};

exports.deleteFile = deleteFile;