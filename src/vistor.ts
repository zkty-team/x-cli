import * as ts from "typescript";

abstract class Vistor {
  fullcontent: string;
  lastcomment: boolean=false;
  abstract visitClass(node: ts.Node): void;
  abstract visitFunc(node: ts.Node): void;
  abstract visitNameSpace(node: ts.Node): void;
  final(): void{};
  extractSRC( node: ts.Node) {
    if(node)
      return this.fullcontent.substring(node.pos, node.end);
    return null
  }
  parse(sourceFile: ts.SourceFile) {
    this.fullcontent = sourceFile.text;
    this.visitNode(sourceFile);
    this.final();
  }
  visitNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
        this.visitFunc(node);
        break;
      case ts.SyntaxKind.InterfaceDeclaration:
        this.visitClass(node);
        break;
      case ts.SyntaxKind.VariableDeclaration:
        this.visitNameSpace(node);
      default:
        break;
    }
    node.forEachChild((n) => {
      this.visitNode(n);
    });
  }

  warning(){
    return `// WARNING. 
// generated by api_generator.js,
// Do not modify this file. It will be overwrite eventually!
`
  }
}
export default Vistor;
