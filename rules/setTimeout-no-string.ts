import * as ts from "typescript";

export default function visit(node: ts.Node, checker: ts.TypeChecker) {

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
        }
    }

    processNode(node);
    node.getChildren().forEach(n => visit(n, checker));
}

