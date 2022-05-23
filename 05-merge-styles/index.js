const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
let arr = [];

async function mergeStyles() {
  for(let file of await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})){
    if (file.isFile()) {
      const filePath = path.extname(file.name);
      if (filePath === '.css') {
        await fsPromises.readFile(path.join(__dirname, 'styles', file.name), 'utf8').then(async function (result) {
          arr.push(result);
          await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), arr);
        });
      }
    }
  }
}
async function run() {
  await mergeStyles();
}
run().then(() => console.log('Merged!'));
