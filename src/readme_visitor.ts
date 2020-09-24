
import Vistor from "./vistor";
import * as ts from "typescript";
import {Arg} from "./Tplt";
import {
  ReadmeTplt,
  APITplt
} from  "./readme_tplt"
export default class ReadmeVisitor extends Vistor {
  // output ios path
  outputPath: string = "./iOS/Class/gen";
  readme: ReadmeTplt     = new ReadmeTplt();
  dtos  : Map<string,APITplt> = new Map<string,APITplt>();


  trimComment(comment:string){
    if(comment.endsWith("*/"))
      return comment.substring(0,comment.length-2);
    return comment
  }
  visistLeadingComment(node:ts.Node){
        // README ideas? todo
    let range = ts.getLeadingCommentRanges(this.fullcontent, node.pos)
    if(range)
    {
      let comment = range.map(element => {
        return this.fullcontent.substring(element.pos+2, element.end)
      }).join("\n");
      return this.trimComment(comment);
    }
    return ""
  }
  visistTrailingComment(node:ts.Node){
        // README ideas? todo
    let range = ts.getTrailingCommentRanges(this.fullcontent, node.pos)
    if(range)
    {
      let comment = range.map(element => {
        return this.fullcontent.substring(element.pos+2, element.end)
      }).join("\n");
      return this.trimComment(comment);
    }
    return ""
  }

  visitFunc(node: ts.Node) {
    const funcname: string = node["name"].text;
    if(funcname.startsWith("test")){
      return
    }
    let api = new APITplt()
    this.readme.apis.push(api) 
    api.comment= this.visistLeadingComment(node)

    let type  = this.visitType(node["type"]);
    const parameters =node["parameters"]
    const type0 = parameters.length > 0
        ? this.visitType(parameters[0]["type"])
        : null;
    if(type0)
      api.args = this.dtos[type0].args;

    api.funcname=funcname
    const body = this.extractSRC(node["body"]);
    api.democode=body;

    const arg0 = node["parameters"].length?node["parameters"][0]:null;
    let defaultarg= arg0?eval("(" + this.extractSRC(arg0["initializer"]) + ")"):{};
    //console.log(defaultarg)
    api.setdefault(defaultarg)

    //console.log(defaultarg)

  }

  final() {
    //console.log(this.readme.finalize())
    this.readme.gen("./h5");
  }

  //dto 
  visitClass(node: ts.Node): void {
    let api = new APITplt();
    api.funcname=node["name"].text
    this.dtos[api.funcname]=api;
    for (let m of node["members"]) {
      let arg = this.visitProperty(m);
      api.args.push(arg)
    }
  }

  visitProperty(node: ts.Node): Arg {
    let arg = new Arg();
    arg.type = this.visitType(node["type"]);
    arg.name = node["name"].text;
    arg.comment=this.visistLeadingComment(node)
    arg.optional = node["questionToken"]!=null;

    return arg;
  }

  visitType(node: ts.Node): string {
    if (!node || !node["kind"]) return null;
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return "string";
      case ts.SyntaxKind.BooleanKeyword:
        return "bool";
      case ts.SyntaxKind.VoidKeyword:
        return "void";
      case ts.SyntaxKind.NumberKeyword:
        return "number";
      case ts.SyntaxKind.TypeReference:
        let tmp: string = "";
        const typename = node["typeName"].text;

        if (typename === "Array") tmp += "Array";
        else if (typename === "Map") tmp += "Map";
        else if (typename === "Set") tmp += "Set";
        else if (typename === "int") tmp += "int";
        else if (typename === "double") tmp += "double";
        else tmp += typename;

        if (node["typeArguments"]) {
          tmp += "\\<";
          const typeArguments = [].slice.call(node["typeArguments"]);
          if (typename === "Map") {
            tmp += this.visitType(typeArguments[0]);
            tmp += ",";
            tmp += this.visitType(typeArguments[1]);
          } else {
            tmp += this.visitType(typeArguments[0]);
          }
          tmp += "\\>";
        }
        return tmp;
      default:
        break;
    }
  }

  visitNameSpace(node: ts.Node) {
    if (node["name"].text === "moduleID") {
      let moduleID = node["initializer"].text;
      let splits = moduleID.split(".");
      this.readme.namespace = moduleID;
    }
  }
}
