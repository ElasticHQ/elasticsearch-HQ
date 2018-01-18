'use strict';
let fs = require('fs');
let args = process.argv;
let path = require('path');

let tester = require('./make_test.js').default;


let dirArr = args[2].split('/');
let cname = dirArr.pop();


// Helper function to flatten nested arrays to a single array
const flatten = arr => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// Have a camel case version of the name 
// Useful for where we want to keep the hyphen in the file names, but return a proper class name
let cnameCamelCased = cname
                        .replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

// Component name ends up going from fooBar to pmuiFooBar
cnameCamelCased = cnameCamelCased.charAt(0).toUpperCase() + cnameCamelCased.slice(1);

let factory = `class ${cnameCamelCased}Factory {

  // Imports go here
  constructor() {
    'ngInject';
    
    // Example function
    this.exampleFunc = (str) => {
      return str;
    };
  }

}

export default ${cnameCamelCased}Factory;
`;

// base spec.js test file
const testFile = tester(cname, 'Factory');


let filesToWrite = [
  { fileName: `${cname}.factory.js`, fileContent: factory },
  { fileName: `${cname}.spec.js`, fileContent: testFile }
];

// Directory of where file will exist at
let dirLoc = flatten([`./ui/src/factories`, dirArr, [cname]]).join('/');

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