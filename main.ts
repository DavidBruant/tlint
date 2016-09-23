/// <reference path="typings/index.d.ts" />
/// <reference path="node_modules/typescript/lib/lib.es6.d.ts" />

import * as ts from "typescript";
import * as fs from "fs";

import r_setTimeoutNoString from "./rules/setTimeout-no-string";
import r_noStringConcat from "./rules/no-string-concat";

const fileNames = process.argv.slice(2);
const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5, 
    module: ts.ModuleKind.CommonJS
}

// Build a program using the set of root file names in fileNames
let program = ts.createProgram(fileNames, options);

// Get the checker, we will use it to find more about classes
let checker = program.getTypeChecker();

// Visit every sourceFile in the program    
for (const sourceFile of program.getSourceFiles()) {
    console.log('sourceFile', sourceFile.fileName)
    if(!sourceFile.fileName.endsWith('/lib.d.ts')){
        ts.forEachChild(sourceFile, node => {
            r_setTimeoutNoString(node, checker);
            r_noStringConcat(node, checker);
        });
    }
}