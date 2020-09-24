import Vistor from "./vistor";
import * as ts from "typescript";
import * as fse from "fs-extra";
import {FileTplt,iMethodTplt,DtoTplt,ClassTplt,MethodTplt,InterfaceTplt} from './java_tplt'

export default class JavaVisitor extends Vistor {
  code: string = "";
  moduleID: string;
  outClassName: string = "";
  moduleName:string;
  dtos: Array<DtoTplt> = [];
  methods: Array<MethodTplt> = [];
  imethods: Array<iMethodTplt> = [];
  fT = new FileTplt();
  classT = new ClassTplt()
  interf = new InterfaceTplt()

  // output ios path
  outputPath():string {return `./android/module-${this.moduleName}/src/main/java/com/zkty/modules/loaded/jsapi`;}
  

  visitFunc(node: ts.Node) {
    const methodName: string = node["name"].text;
    if(methodName.startsWith("test")){
      return
    }

    let mt = new MethodTplt()
    let imt = new iMethodTplt()
    mt.methodName=methodName;
    imt.methodName=methodName;
    const ret: string = this._visitType(node["type"]) || null;
    mt.retType=ret;
    imt.retType=ret;
    const type0 = node["parameters"].length > 0
        ? this._visitType(node["parameters"][0]["type"])
        : "";
    mt.argType = type0;
    imt.argType=type0;
    this.methods.push(mt);
    this.imethods.push(imt);
    
  }

  final() {
    this.classT.methods=this.methods;
    this.fT.dtos = this.dtos;
    this.fT.clazz=this.classT.finalize(); this.interf.imethods=this.imethods.map(s=>s.finalize());
    this.fT.interf=this.interf.finalize()

    

    //console.log(this.fT.finalize())
    const outjava= `${this.outputPath()}/${this.outClassName}.java`;
    fse.outputFile(
      `${outjava}`,
      this.fT.finalize(),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${outjava} was saved!`);
        }
      }
    );

  }

  visitClass(node: ts.Node): void {
    let dto = new DtoTplt();
    this.dtos.push(dto)
    dto.clsname=node["name"].text

    for (let m of node["members"]) {
      let property:string=this.visitProperty(m);
      dto.properties.push(property)
    }
  }

  visitProperty(node: ts.Node) {
    //todo 
    const nullable = node["questionToken"];
    let property:string = this.visitType(node["type"], node)+ " " + node["name"].text + ";\n";
    if(nullable){
      property="@Optional\n"+"\t\t"+property
    }

    return property;
  }

  visitType(node: ts.Node, property_node: ts.Node) {
    let tmp:string = `public `;
    tmp += this._visitType(node);
    return tmp
  }


  _visitType(node: ts.Node): string {
    if (!node || !node["kind"])return null;
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return "String";
      case ts.SyntaxKind.BooleanKeyword:
        return "boolean";
      case ts.SyntaxKind.FunctionType:
        // 所有函数都会转为字符串做为回调函数名处理
        return "String"
      case ts.SyntaxKind.VoidKeyword:
        return null;
      case ts.SyntaxKind.NumberKeyword:
        return  "double";
      case ts.SyntaxKind.TypeReference:

        let tmp: string = "";
        const typename = node["typeName"].text;

        if (typename === "Array") tmp += "List";
        else if (typename === "Map") tmp += "Map";
        else if (typename === "Set") tmp += "Set";
        else if (typename === "int") tmp += "Integer";
        else if (typename === "double") tmp += "double";
        else tmp += typename;

        if (node["typeArguments"]) {
          tmp += "<";
          const typeArguments = [].slice.call(node["typeArguments"]);
          if (typename === "Map") {
            tmp += this._visitType(typeArguments[0]);
            tmp += ",";
            tmp += this._visitType(typeArguments[1]);
          } else {
            tmp += this._visitType(typeArguments[0]);
          }
          tmp += ">";
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
      this.moduleName = splits[3];
      this.outClassName = `xengine__${splits[2]}_${splits[3]}`;
      this.fT.packageName ="com.zkty.modules.loaded.jsapi"
      this.classT.clsname=this.outClassName
      this.interf.clsname=this.outClassName
      this.classT.moduleID=moduleID
    }
  }
}

