var fs = require('fs');

let isDirectory = (filename, path) => (fs.statSync(`${path}/${filename}`).isDirectory());
let isFile = (filename, path) => fs.statSync(`${path}/${filename}`).isFile();
let isExists = (filename) => fs.existsSync(`${root}/${filename}`)
let filterIgnoredFiles = (filename) => (gitignore.indexOf(filename) < 0);
let mapStringToMD = (filename) => (
  `* [${filename}](https://github.com/IgorMotorny/library/blob/master/books/${filename}) `
)
let bookMapper = (path) => ({

})
let foderMapper = (filename, path) => ({[filename] : read(`${path}/${filename}`)})
/**
{
 general: [
 { filename: '...', path: '...' },
 ...
],
theme1: [
{ filename: '...', path: '...' },
...
],
[
{ filename: '...', path: '...' },
...
]
}
*/
/**
{
  general: [ 'Discover Meteor(Tom Coleman).pdf',  ... ],
  Backbone: { general: [ 'Разработка Backbone.js приложений (2014,Эдди Османи)_.pdf' ] },
  JQuery: { general:[ ... ] },
  'Ng-book': { general: [ ... ] },
  'You don\'t know js': { general:[ ... ] }
}

*/
function read(path) {
   const dir = fs.readdirSync(path);
   const files = dir.filter((filename) => isFile(filename, path))
                    .filter(filterIgnoredFiles);
   const directories = dir.filter((filename) => isDirectory(filename, path));
   const a = directories.map((filename) => foderMapper(filename, path));
   return Object.assign({}, {
     general: files
   }, ...a);
}

function createReadme(obj, path = []) {
  let buff = [];
  if(obj instanceof Object && !Array.isArray(obj)) {
    for(key in obj) {
      if(key !== 'general') {
        const childPath = path.push(key);
        buff.push(`\n## ${key}\n`);
        buff.push(...createReadme(obj[key], childPath));
      } else {
        buff.push(...createReadme(obj[key]));
      }
    }
  } else {
    obj.forEach((item) => { buff.push(`\n* <a href="https://github.com/IgorMotorny/library/blob/master/books/${path}${item}">${item.replace(/\(.*?\)/, '')}</a> \n`); });
  }
  return buff;
}

const root = './books';
const gitignore = fs.readFileSync('.gitignore').toString().split('\n');
const directory =  fs.readdirSync(root).filter(filterIgnoredFiles);

fs.writeFile('README.md', `#Frontend books \n ${createReadme(read('./books')).join('')}`);
