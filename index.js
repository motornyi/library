const fs = require('fs');
const md5 = require('js-md5');

let gitignore;
let isDirectory = (path, filename) => (fs.statSync(`${path}/${filename}`).isDirectory());
let isFile = (path, filename) => fs.statSync(`${path}/${filename}`).isFile();
let isIgnored = (filename) => (gitignore.indexOf(filename) < 0);
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
    .filter(isIgnored)
    .map(bookMapperBinded);

  const files = dir.filter(isDirectoryBinded)
    .map((filename) => folderMapper(path, filename));

  return Object.assign({}, { general: rootFiles }, ...files);
}


function flatMap(obj) {
  let bundle = [];
  if(obj instanceof Object && !Array.isArray(obj)) {
    for(key in obj) {
      if(key !== 'general') bundle.push(` ## ${key} \n\n `);
      bundle.push(...flatMap(obj[key]));
    }
  } else {
    // Array
    // copy file here
    obj.forEach((item) => {
      fs.createReadStream(item.path).pipe(fs.createWriteStream(`./dist/${item.hash}.pdf`));
      bundle.push(`* [${item.filename.replace(/.pdf/, '')}](./dist/${item.hash}.pdf) \n\n `)
    });
  }
  return bundle;
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  })
}

function readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}

readFile('.gitignore').then((data) => {
  gitignore = data.toString().split('\n');
  fs.writeFile('README.md', `#Frontend books \n ${flatMap(read('./books')).join('')}`);
})
