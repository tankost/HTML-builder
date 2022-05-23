const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
let arr = [];
const copyFrom = path.join(__dirname,'assets');
const copyTo = path.join(__dirname,'project-dist', 'assets');

async function mergeStyles() {
  for(let file of await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})){
    if (file.isFile()) {
      const filePath = path.extname(file.name);
      if (filePath === '.css') {
        await fsPromises.readFile(path.join(__dirname, 'styles', file.name), 'utf8').then(async function (result) {
          arr.push(result);
          await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), arr);
        });
      }
    }
  }
}

async function changeTemplate() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');

  await fsPromises.readdir(path.join(componentsPath), {withFileTypes: true}).then(async function (components) {
    await fsPromises.readFile(path.join(templatePath), 'utf8').then(async function (template) {
      for (let component of components) {
        const componentName = path.basename(component.name, path.extname(component.name));
        await fsPromises.readFile(path.join(componentsPath, component.name), 'utf8').then(async function (content) {
          template = template.replace(`{{${componentName}}}`, content);
          await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'),template);
        });
      }
    });
    await mergeStyles();
  });
}

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
  await changeTemplate();
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
    copyDir(copyFrom, copyTo).then(() => console.log('Built!'));
  });
}
clearCopyDir(copyTo);
