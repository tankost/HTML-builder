const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, files) => {
  if (error) throw error;
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = path.basename(file.name, path.extname(file.name));
      const filePath = path.extname(file.name).slice(1);
      fs.stat(path.join(__dirname, 'secret-folder',file.name),(error, stats) => {
        if (error) throw error;
        console.log(`${fileName} - ${filePath} - ${stats.size} bytes`);
      });
    }
  });
});
