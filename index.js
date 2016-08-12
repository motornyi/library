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
const root = './books';
const gitignore = fs.readFileSync('.gitignore').toString().split('\n');
const directory =  fs.readdirSync(root).filter(filterIgnoredFiles);

// const folders = directory.filter(isDirectory);
// const files = directory.filter(isFile);

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
/**
{ general:
   [ 'Discover Meteor(Tom Coleman).pdf',
     'JavaScript для профессиональных веб-разработчиков(2013,Николас Закас).pdf',
     'JavaScript. Карманный справочник(Дэвид Флэнаган,2013) vk.com_webtackles.pdf',
     'JavaScript. Оптимизация производительности (2012,Николас Закас).pdf',
     'JavaScript. Подробное руководство (2012,Дэвид Флэнаган).pdf',
     'JavaScript. Сильные стороны(2012, Д. Крокфорд).pdf',
     'JavaScript. Шаблоны - (2011,Стоян Стефанов).pdf',
     'Быстрое прототипирование с JS(Azat Mardan, 2014).pdf',
     'Веб приложения на JavaScript(2012,Алекс Маккоу).pdf',
     'Выразительный JavaScrip(2014, М. Хавербек).pdf',
     'Графика на JavaScript(Рафаэлло Чекко, 2013).pdf',
     'Изучаем JavaScript (2012, Моррисон М).pdf',
     'Паттерны для масштабируемых JavaScript-приложений vk.com_webtackles.pdf',
     'Секреты JavaScript ниндзя(Джон Резиг, 2015).pdf',
     'Сила JavaScript. 68 способов эффективного использования JS(2013, Херман Д.).pdf',
     'Сюрреализм на JavaScript(2014, А. Бахирев).pdf' ],
  Backbone: { general: [ 'Разработка Backbone.js приложений (2014,Эдди Османи)_.pdf' ] },
  JQuery:
   { general:
      [ 'jQuery Trickshots((Tutorialzine)).pdf',
        'jQuery. Cборник рецептов - (2011,Самков Г. А.).pdf',
        'jQuery. Подробное руководство по продвинутому JavaScript(2011,Bear Bibeault).pdf' ] },
  'Ng-book': { general: [ 'ng-book 2.pdf', 'ng-book.pdf' ] },
  NodeJS:
   { general:
      [ 'Node.js в действии(2014, М.Кантелон).pdf',
        'Node.js. Путеводитель по техологии(К. Сухов, 2015).pdf',
        'Изучаем Node.js(2014,Shelli Pauers).pdf' ] },
  'You don\'t know js':
   { general:
      [ 'You don\'t know js - async & performance.pdf',
        'You don\'t know js - es6.pdf',
        'You don\'t know js - scope & clousers .pdf',
        'You don\'t know js - this & object prototypes.pdf',
        'You don\'t know js - types & grammar.pdf',
        'You don\'t know js - up & going.pdf' ] } }

*/
function createReadme(obj) {
  let buff = [];
  if(obj instanceof Object && !Array.isArray(obj)) {
    for(key in obj) {
      if(key !== 'general') {
        buff.push(`## ${key}\n`);
        buff.push(...createReadme(obj[key]));
      } else {
        buff.push(...createReadme(obj[key]));
      }
    }
  } else {
    obj.forEach((item) => { buff.push(`* [${item}](https://github.com/IgorMotorny/library/blob/master/books/${item}) \n`); });
  }
  return buff;
}

// createReadme();
// console.log();
  fs.writeFile('README.md', createReadme(read('./books')).join('\n'));
