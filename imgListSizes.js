const gm = require('gm');
const fs = require('fs');

const imgFolder = '../photos/slideshow';
let imgs = [];


let files = fs.readdirSync(imgFolder);
let i = 0;
files.forEach(file => {
  gm('../photos/slideshow/'+file).size(function (err, size) {
    if (!err) {
      imgs.push({
        'file': file,
        'width': size.width, 
        'height': size.height,
        'ratio': Math.round((size.width/size.height) * 100) / 100
      });
      console.log(imgs);
    }
    else console.log(err);
  });
});

