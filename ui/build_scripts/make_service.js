'use strict';
let fs = require('fs');
let args = process.argv;
let path = require('path');

let tester = require('./make_test.js').default;


// If name passed in like 'some/path/to/real-name'
//  then folder and controller name will be 'real-name'.
//  The 'some/path/to' will be the nested directory('s')
let dirArr = args[2].split('/');
let cname = dirArr.pop();



// Helper function to flatten nested arrays to a single array
const flatten = arr => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// Have a camel case version of the name 
// Useful for where we want to keep the hyphen in the file names, but return a proper class name
let cnameCamelCased = cname
                        .replace(/^[a-z]/, function (m){ return m.toUpperCase() })
                        .replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });


let service = `class ${cnameCamelCased}Service {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  // Example request
  // getExample(params) {
  //   return this.$http({
  //             url: ('/example'),
  //             method: 'GET',
  //             params: params
  //           });
  // }
}

export default ${cnameCamelCased}Service;
`;

// base spec.js test file
const testFile = tester(cname, 'Service');


let filesToWrite = [
  { fileName: `${cname}.service.js`, fileContent: service },
  { fileName: `${cname}.spec.js`, fileContent: testFile }
];

// Directory of where file will exist at
let dirLoc = flatten([`./ui/src/services`, dirArr, [cname]]).join('/');

// Create the directory structure if it does not exists.
// FIXME
// Should be in a util shared between files
dirLoc.split('/').forEach((dir, index, splits) => {
  const parent = splits.slice(0, index).join('/');
  const dirPath = path.resolve(parent, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
});


fs.mkdir(dirLoc, (err) => {
  if (err && err.code !== 'EEXIST') throw err;

  filesToWrite.map((file) => {
    fs.writeFile(dirLoc + '/' + file.fileName, file.fileContent, (err) => {
      if (err) throw err;
      console.log(`${file.fileName} created`);
    });
  });

});