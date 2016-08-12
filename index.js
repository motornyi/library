var fs = require('fs');


// function readDir(path) {
//   return fs.readdirSync(path)
//     .sort((item) => { return sortByType(path + '/' + item) })
//     .map((item) => {
//       return fileMapper(path + '/' + item, item);
//     })
// }
//
// function sortByType(path) {
//   console.log(fs.statSync(path).isDirectory());
//   return fs.statSync(path).isDirectory();
// }
//
// function fileMapper(path, filename) {
//
//   if(fs.statSync(path).isDirectory()) {
//
//     return readDir(path);
//   } else {
//     return filename;
//   }
// }
//

//
// console.log(readDir('./books'));
function isDirectory(filename) {
  return fs.statSync(`${root}/${filename}`).isDirectory();
}

function isFile(filename) {
  return fs.statSync(`${root}/${filename}`).isFile();
}

function isExists(filename) {
  return fs.existsSync(`${root}/${filename}`)
}

const root = './books';
const gitignore = fs.readFileSync('.gitignore').toString().split('\n');
const directory =  fs.readdirSync(root).filter((filename) => (gitignore.indexOf(filename) < 0));

const folders = directory.filter(isDirectory);
const files = directory.filter(isFile);

function createReadme() {
  let stringBuffer = [];
  stringBuffer.push('# Frontend books \n')
  stringBuffer.push(...files.map((filename) => `* [${filename}](https://github.com/IgorMotorny/library/blob/master/books/${filename}`))
  const resultString = stringBuffer.join('\n');
  fs.writeFile('README.md', resultString);
}

createReadme();
