const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const copyFrom = path.join(__dirname,'files');
const copyTo = `${copyFrom}-copy`;

async function copyDir(copyFrom, copyTo) {
  await fsPromises.mkdir(copyTo, { recursive: true });
  for(let file of await fsPromises.readdir(path.join(copyFrom), {withFileTypes: true})){
    const filePath = path.join(copyFrom, file.name);
    const copiedFilePath = path.join(copyTo, file.name);
    if(file.isFile()){
      await fsPromises.copyFile(filePath, copiedFilePath);
    }
    else if(file.isDirectory()){
      await copyDir(filePath, copiedFilePath);
    }
  }
}

function clearCopyDir(copyTo) {
  fs.readdir(path.join(__dirname),{withFileTypes: true}, (error, files) => {
    if (error) throw error;
    for (let file of files) {
      if (path.join(__dirname,file.name) === copyTo) {
        fs.rm(path.join(__dirname,file.name), {recursive:true, force:true}, ()=> {
        });
      }
    }
    copyDir(copyFrom, copyTo).then(() => console.log('Copied!'));
  });
}

clearCopyDir(copyTo);
