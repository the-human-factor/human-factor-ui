// taken from the favicons script in gatsby-universal.
const favicons = require('favicons');
const path = require('path');
const fs = require('fs');
const config = require('../manifest');

const OUTPUT_PATH = '../public/gen/';
const SOURCE_PATH = '../src/images/icon.png';

console.log('-----');
console.log(`ls ${__dirname}`);
fs.readdir(__dirname, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

const outputDir = path.resolve(__dirname, OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {recursive: true});
}
const index = path.resolve(__dirname, '../src/index.html');
const outputIndex = path.resolve(__dirname, '../public/index.html');


const fullConfig = {
  path: '/gen/',
  developerName: null,
  developerURL: null,
  dir: 'auto',
  lang: 'en-US',
  display: 'standalone',
  orientation: 'any',
  version: '1.0',
  logging: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,
    yandex: false,
  },
  ...config,
};

const writeTo = (dir, file) => fs.writeFile(
  path.resolve(__dirname, dir, file.name),
  file.contents,
  err => {
    if (err) {
      console.log(err);
    }
  }
);


const callback = function(err, res) {
  if (err) {
    return console.log(err);
  }
  res.images.forEach(image => writeTo(OUTPUT_PATH, image));
  res.files.forEach(file => writeTo(OUTPUT_PATH, file));

  console.log('Writing index.html');
  fs.readFile(index, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace('<!--FAVICON_HTML-->', res.html.join(''));

    fs.writeFile(outputIndex, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
};

favicons(SOURCE_PATH, fullConfig, callback);
