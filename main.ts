/// <reference path="typings/index.d.ts" />
/// <reference path="node_modules/typescript/lib/lib.es6.d.ts" />

import * as ts from "typescript";
import * as fs from "fs";

interface DocEntry {
    name?: string,
    fileName?: string,
    documentation?: string,
    type?: string,
    constructors?: DocEntry[],
    parameters?: DocEntry[],
    returnType?: string
};

/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): void {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    let output: DocEntry[] = [];

    // Visit every sourceFile in the program    
    for (const sourceFile of program.getSourceFiles()) {
        console.log('sourceFile', sourceFile.fileName)
        if(!sourceFile.fileName.endsWith('/lib.d.ts')){
            ts.forEachChild(sourceFile, visit);
        }
    }

    function processCallExpression(node: ts.CallExpression){
        // This is a top level class, get its symbol
        const functionExpression = node.expression;
        const functionType = checker.getTypeAtLocation(functionExpression);
        const functionName = functionType.getSymbol().getName();

        console.log('fn type name', functionName);
        //console.log('fn type decl', functionType.getSymbol().getDeclarations()[0].getText());
        
        if(functionName === 'setTimeout'){
            const firstArgExpression = node.arguments[0];
            const firstArgType = checker.getTypeAtLocation(firstArgExpression);

            //console.log('arg type name', firstArgType);
            //console.log('arg type decl', firstArgType.getSymbol().getDeclarations()[0].getText());

            if(firstArgType.getCallSignatures().length >= 1){
                console.log('first setTimeout arg is a function as it should be');
            }
            else{
                console.log('first setTimeout arg is not a function', firstArgType.getFlags());
            }
        }

    }

    function processNode(node: ts.Node){
        if (node.kind === ts.SyntaxKind.CallExpression) {
            console.log('CallExpression', (<ts.CallExpression>node).getFullText());
            processCallExpression(<ts.CallExpression>node)
            
            
            //output.push(serializeClass(symbol));
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    /** visit nodes finding exported classes */    
    function visit(node: ts.Node) {
        processNode(node);
        node.getChildren().forEach(visit);
    }

}

generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});