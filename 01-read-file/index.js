const fs = require('fs');
const path = require('path');
const pathToText  = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(pathToText, 'utf8');

rs.on('data', chunk => {
  console.log(chunk);
});