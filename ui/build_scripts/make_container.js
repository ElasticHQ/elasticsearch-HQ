'use strict';
let fs = require('fs');
let args = process.argv;
let path = require('path');

let tester = require('./make_test.js').default;


let dirArr = args[2].split('/');
let cname = dirArr.pop();


const flatten = arr => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

let cnameCamelCased = cname.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

let controller = `import './${cname}.style.scss'

class ${cnameCamelCased}Controller {

  // Imports go here
  constructor() {
    'ngInject';
    
  }
}

export default ${cnameCamelCased}Controller;
`;

let view = `<div class="${cname}"> ${cname} </div>`;


let style = `.${cname} {
  
}`

const testFile = tester(cname, 'Container');


let filesToWrite = [
  { fileName: `${cname}.controller.js`, fileContent: controller },
  { fileName: `${cname}.spec.js`, fileContent: testFile },
  { fileName: `${cname}.view.html`, fileContent: view },
  { fileName: `${cname}.style.scss`, fileContent: style }
];

let dirLoc = flatten([`./ui/src/containers`, dirArr, [cname]]).join('/');

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