
import Vistor from "./vistor";
import * as ts from "typescript";
import {
  DTOTmplt,
  PropertyTmplt,
  ClassTmplt,
  ProtocolMethod,
  ClassMethodTmplt,
  FileTmplt
} from "./oc_tplt";

export default class OCVisitor extends Vistor {
  // output ios path
  outputPath: string = "./iOS/Class/gen";
  fileTmplt: FileTmplt =new FileTmplt();
  classTmplt: ClassTmplt = this.fileTmplt.classTmplt;


  isPrimitive(type:string):boolean{
    let primitives = new Set(["BOOL","NSInteger","NSString*","NSNumber"])
    return primitives.has(type);
  }
  visitFunc(node: ts.Node) {
    const methodName: string = node["name"].text;
    if(methodName.startsWith("test") || methodName.startsWith("_test")){
      return
    }
    let method = new ClassMethodTmplt();
    method.methodName = methodName;
    method.retType = this.visitType(node["type"]);
    if(method.retType)
      method.retPrimitive=this.isPrimitive(method.retType)


    const type0 = node["parameters"].length > 0
        ? this.visitType(node["parameters"][0]["type"])
        : null;
    method.argType=type0;

    let pmethod = new ProtocolMethod();
    pmethod.methodName=method.methodName
    pmethod.argType=method.argType
    pmethod.retType=method.retType

    this.classTmplt.methods.push(method);
    this.fileTmplt.protocolTmplt.methods.push(pmethod);
  }

  final() {
    this.fileTmplt.hgen(this.outputPath);
    this.fileTmplt.mgen(this.outputPath);
  }

  visitClass(node: ts.Node): void {
    let dto = new DTOTmplt();
    this.fileTmplt.dtoTmplts.push(dto);
    let mname = node["name"].text;
    dto.name = mname;
    for (let m of node["members"]) {
      let p = this.visitProperty(m);
      dto.properties.push(p);
    }
  }

  visitProperty(node: ts.Node): PropertyTmplt {
    let p = new PropertyTmplt();
    p.nullable = node["questionToken"] != null;
    p.name = node["name"].text;
    p.mod = this.visitMod(node["type"]);
    p.type = this.visitType(node["type"]);
    return p;
  }

  visitMod(node: ts.Node) {
    let mod = "strong";
    if (node.kind == ts.SyntaxKind.StringKeyword) mod = "copy";
    if (node.kind == ts.SyntaxKind.NumberKeyword) mod = "strong";
    if (node.kind == ts.SyntaxKind.BooleanKeyword) mod = "assign";
    if (node.kind == ts.SyntaxKind.TypeReference ) {
      if(node["typeName"].text === "int")
        {
          mod = "assign";
        }
      else if(  node["typeName"].text === "double"){

          mod = "strong";
      }
    }
    return mod;
  }

  visitType(node: ts.Node,isdict:boolean=false): string {
    if (!node || !node["kind"]) return null;
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return "NSString*";
      case ts.SyntaxKind.BooleanKeyword:
        return "BOOL";
      case ts.SyntaxKind.VoidKeyword:
        return "void";
      case ts.SyntaxKind.FunctionType:
        // 所有函数都会转为字符串做为回调函数名处理
        return "NSString*"
      case ts.SyntaxKind.NumberKeyword:
        return "NSNumber*";
      case ts.SyntaxKind.TypeReference:
        let tmp: string = "";
        const typename = node["typeName"].text;

        if (typename === "Array") tmp += "NSArray";
        else if (typename === "Map") tmp += "NSDictionary";
        else if (typename === "Set") tmp += "NSSet";
        else if (typename === "int") tmp += "NSInteger";
        else if (typename === "double") tmp += "NSNumber*";
        else tmp += isdict?typename:(typename + "*");

        if (node["typeArguments"]) {
          tmp += "<";
          const typeArguments = [].slice.call(node["typeArguments"]);
          if (typename === "Map") {
            tmp += this.visitType(typeArguments[0],true);
            tmp += ",";
            tmp += this.visitType(typeArguments[1],true);
          } else {
            tmp += this.visitType(typeArguments[0],true);
          }
          tmp += ">*";
        }
        return tmp;
      default:
        //console.log(node)
        break;
    }
  }

  visitNameSpace(node: ts.Node) {
    if (node["name"].text === "moduleID") {
      let moduleID = node["initializer"].text;
      let splits = moduleID.split(".");
      this.classTmplt.moduleName = splits[3];
      this.classTmplt.moduleID = node["initializer"].text;
      this.fileTmplt.protocolTmplt.moduleName=splits[3];
      this.fileTmplt.moduleName=splits[3];
    }
  }
}
