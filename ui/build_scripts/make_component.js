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

let componentCname = cnameCamelCased.charAt(0).toUpperCase() + cnameCamelCased.slice(1);


let component = `import template from './${cname}.template.html';
import controller from './${cname}.controller';

const ${cnameCamelCased}Component = {
  template,
  controller,
  controllerAs: '${cnameCamelCased}Ctrl'
};

export default ${cnameCamelCased}Component;
`;

let style = `.${cname} {
  
}`


let controller = `import './${cname}.style.scss'

class ${cnameCamelCased}Controller {

}

export default ${cnameCamelCased}Controller;
`;

// .js
let mod = `import angular from 'angular';
import ${cnameCamelCased} from './${cname}.component';

export default angular.module('eshq.${cnameCamelCased}', [])
  .component('eshq${componentCname}', ${cnameCamelCased})
  .name;
`;

// template.html
let template = `<div class="${cname} "> ${cname} </div>`;

// base spec.js test file
const testFile = tester(cname, 'Component');


let filesToWrite = [
  { fileName: `${cname}.component.js`, fileContent: component },
  { fileName: `${cname}.spec.js`, fileContent: testFile },
  { fileName: `${cname}.controller.js`, fileContent: controller },
  { fileName: `${cname}.js`, fileContent: mod },
  { fileName: `${cname}.template.html`, fileContent: template },
  { fileName: `${cname}.style.scss`, fileContent: style }
  
];

// Directory of where file will exist at
let dirLoc = flatten([`./ui/src/components`, dirArr, [cname]]).join('/');

// Create the directory structure if it does not exists.
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
    fs.writeFile(dirLoc + '/' +  file.fileName, file.fileContent, (err) => {
      if (err) throw err;
      console.log(`${file.fileName} created`);
    });
  });

});
