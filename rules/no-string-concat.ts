import * as ts from "typescript";

function isBinaryExpressionNode(node: ts.Node) : node is ts.BinaryExpression{
    return node.kind === ts.SyntaxKind.BinaryExpression
}

export default function visit(node: ts.Node, checker: ts.TypeChecker) {

    // process node
    if (isBinaryExpressionNode(node)) {
        const operatorTokenNode = node.operatorToken;
        
        if(operatorTokenNode.kind === ts.SyntaxKind.PlusToken){ // +
            const leftNode = node.left;
            const leftType = checker.getTypeAtLocation(leftNode);
            const leftTypeFlags = leftType.getFlags();

            const rightNode = node.right;
            const rightType = checker.getTypeAtLocation(rightNode);
            const rightTypeFlags = rightType.getFlags();

            if((rightTypeFlags & ts.TypeFlags.String) && (leftTypeFlags & ts.TypeFlags.String) ){
                console.log('String concatenation are forbidden')
            }
            else{
                console.log('legit use of + (not string concatenation)')
            }
        }
    }
    

    // traverse children
    node.getChildren().forEach(n => visit(n, checker));
}

