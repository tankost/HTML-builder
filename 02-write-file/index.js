const fs = require('fs');
const path = require('path');
const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf8');

console.log('Hello! Please, type something!');
process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    if (chunk.toString('utf8').trim() === 'exit') {
      console.log('Thanks! Have a good day!');
      process.exit(0);
    }
    ws.write(chunk);
  }
});
process.on('SIGINT', () => {
  console.log('Thanks! Have a good day!');
  process.exit(0);
});
