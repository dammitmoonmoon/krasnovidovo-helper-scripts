const fs = require('fs');

let targetAddress = '../../dist/data/weather/';
let scrAddress = '../../weather-daily.csv';
const dataset = convertToArray(scrAddress);


splitDataset(dataset);

function convertToArray(src){
  return fs.readFileSync(src).toString().match(/^.+$/gm);
}

function splitDataset(dataset) {
  const title = dataset.shift();
  let set = [];
  const firstYear = dataset[0].slice(0,4);
  let currentYear = firstYear;
  set[0] = title;

  dataset.forEach((line) => {
    if (line.slice(0,4) == currentYear) {
      set.push(line);
    }
    else {
      writeCSV(set, currentYear);
      currentYear++;
      set = [title];
    }
  });
  writeCSV(set, currentYear);
}

function writeCSV(set, year) {
  fs.writeFile(`${targetAddress}/${year}.csv`, set.join('\n'), (error) => {
    if(error) throw error; 
});
}
