var sass = require('node-sass');
var path = require('path');
var fs = require('fs');
var dir = 'dist/css/vehicles/';

function getSvgSheets() {
  var folderPath = path.join(process.cwd(), 'src/styles/sass/vehicle');
  var svgCssFolder = fs.readdirSync(folderPath);
  var sheets = [];

  svgCssFolder.forEach(function(filename) {
    var filePath = path.join(folderPath, filename);
    var stats = fs.lstatSync(filePath);
    var subFolder;

    if (!stats.isDirectory()) {
      sheets.push({
        foldername: filename.replace('.css.scss', ''),
        filepath: filePath
      });
    }
  });

  return sheets;
}

getSvgSheets().forEach(function(sheet) {
  sass.render({
    file: sheet.filepath,
    outputStyle: 'compressed'
  }, function(err, result) {
    if (err) {
      throw err;
    } else {
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      var fileName = dir + sheet.foldername + '.min.css';
      fs.writeFile(fileName, result.css.toString(), function errorHandler(err) {
        if (err) throw err;
      });
    }
  });
});
