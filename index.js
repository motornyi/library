const fs = require('fs');
const md5 = require('js-md5');

let isDirectory = (path, filename) => (fs.statSync(`${path}/${filename}`).isDirectory());
let isFile = (path, filename) => fs.statSync(`${path}/${filename}`).isFile();
let isExists = (filename) => fs.existsSync(`${root}/${filename}`)
let filterIgnoredFiles = (filename) => (gitignore.indexOf(filename) < 0);
let mapStringToMD = (filename) => (
  `* [${filename}](https://github.com/IgorMotorny/library/blob/master/books/${filename}) `
)

let folderMapper = (path, filename) => ({[filename] : read(`${path}/${filename}`)})

let bookMapper = (path, filename) => ({
  filename: filename,
  path: `${path}/${filename}`,
  hash: md5(filename)
});

function read(path) {
  const dir = fs.readdirSync(path);

  let isFileBinded = isFile.bind(null, path);
  let bookMapperBinded = bookMapper.bind(null, path);
  let isDirectoryBinded = isDirectory.bind(null, path);

  const rootFiles = dir.filter(isFileBinded)
    .filter(filterIgnoredFiles)
    .map(bookMapperBinded);

  const files = dir.filter(isDirectoryBinded)
    .map((filename) => folderMapper(path, filename));

  return Object.assign({}, { general: rootFiles }, ...files);
}

function flatMap(obj) {
  let bundle = [];
  if(obj instanceof Object && !Array.isArray(obj)) {
    for(key in obj) {
      // console.log(flatMap(obj[key]));
      bundle.push(...flatMap(obj[key]));
    }
  } else {
    // Array
    // copy file here
    obj.forEach((item) => {
      fs.writeFileSync(`./dist/${item.hash}.pdf`, fs.readFileSync(item.path));
      bundle.push(` * [${item.filename.replace(/.pdf/, '')}](./dist/${item.hash}.pdf) \n`)
    });
  }
  return bundle;
}
//
// function createReadme(obj) {
//   let buff = [];
//   if(obj instanceof Object && !Array.isArray(obj)) {
//     for(key in obj) {
//       if(key !== 'general') {
//         const childPath = path.push(key);
//         buff.push(`\n## ${key}\n`);
//         buff.push(...createReadme(obj[key]));
//       } else {
//         buff.push(...createReadme(obj[key]));
//       }
//     }
//   } else {
//     obj.forEach((item) => { buff.push(`\n* <a href="./dist/${item.hash}.pdf) }">${item.replace(/\(.*?\)/, '')}</a> \n`); });
//   }
//   return buff;
// }

const root = './books';
const gitignore = fs.readFileSync('.gitignore').toString().split('\n');
const directory =  fs.readdirSync(root).filter(filterIgnoredFiles);

fs.writeFile('README.md', `#Frontend books \n ${flatMap(read('./books')).join('')}`);
// console.log();
// flatMap(read('./books'))
