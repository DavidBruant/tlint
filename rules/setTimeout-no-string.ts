import * as ts from "typescript";

function isCallExpression(node: ts.Node) : node is ts.CallExpression{
    return node.kind === ts.SyntaxKind.CallExpression
}

export default function visit(node: ts.Node, checker: ts.TypeChecker) {

    // process node
    if (isCallExpression(node)) {
        const functionExpression = node.expression;
        const functionType = checker.getTypeAtLocation(functionExpression);
        const functionName = functionType.getSymbol().getName();

        //console.log('fn type decl', functionType.getSymbol().getDeclarations()[0].getText());
        
        // TODO modify to find the correct setTimeout type
        if(functionName === 'setTimeout'){
            const firstArgExpression = node.arguments[0];
            const firstArgType = checker.getTypeAtLocation(firstArgExpression);

            //console.log('arg type decl', firstArgType.getSymbol().getDeclarations()[0].getText());

            if(firstArgType.getCallSignatures().length >= 1){
                console.log('first setTimeout arg is a function as it should be');
            }
            else{
                console.log('first setTimeout arg is not a function', firstArgType.getFlags());
            }
        }
    }
    

    // traverse children
    node.getChildren().forEach(n => visit(n, checker));
}

