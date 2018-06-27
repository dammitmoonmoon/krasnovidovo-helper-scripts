const fs = require('fs');


let folder = '../../dist/data/weather/';

// 0. get folder from user
function setFolder(userInput) {
  if (userInput) {
    folder = process.argv[2];
  }
}

// 1. collect list of all files
function getFileList() {
  return fs.readdirSync(folder).filter(file => file.endsWith('.csv')).map(file => {
    return file;
  });
}

// 2. convert csv file into an array of strings: ['A:a1, B:b1, C:c1', 'A:a2, B:b2, C:c2'...]
function getArrayFromFile(file) {
  let srcAddress = `${folder}${file}`;
  return fs.readFileSync(srcAddress).toString().match(/^.+$/gm);
}

// 3. convert array of strings into array of objects: [ {A:a1, B:b1, C:c1}, {A:a2, B:b2, C:c2}, ... ]
function convertToArrayOfObjects(dataset) {
  const columns = dataset.shift().split(';');
  let title = columns[0];
  let rows = dataset.map((line) => {
    return line.split(';');
  });

  let arrayOfObjects = rows.map((line) => {
    return line.reduce((result, item, index) => {
      result[columns[index]] = item;
      return result;
    }, {});
  })
  return {arrayOfObjects, title};
}

// 4. convert array of objects into a pre-JSON object: { a1 : {B:b1, C:c1}, b1 : {B:b2, C:c2} }
function convertToPreJSONObject(arrayOfObjects, title) {
  let preJSONObject = {};
  arrayOfObjects.forEach((object) => {
    let {[title]: key, ...obj1} = object;
    preJSONObject[key] = obj1;
  })
  return preJSONObject;
}

// 5. convert pre-JSON object to JSON
function convertToJSON(preJSONObject) {
  return JSON.stringify(preJSONObject);
}

// 6. write JSON to file
function writeToFile(json, file) {
  let srcAddress = `${folder}${file}`;
  fs.writeFile(`${srcAddress.slice(0,-4)}.json`, json, (error) => {
    if(error) throw error; 
  });
}

// main function
function convertFile(file) {
  let dataset = getArrayFromFile(file);
  let {arrayOfObjects, title} = convertToArrayOfObjects(dataset);
  let preJSONObject = convertToPreJSONObject(arrayOfObjects, title);
  let json = convertToJSON(preJSONObject);
  writeToFile(json, file);
}

setFolder(process.argv[2]);
getFileList().forEach(file => convertFile(file));