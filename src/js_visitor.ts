
import Vistor from "./vistor";
import * as ts from "typescript";
import {HTMLTplt,IndexTplt,DemoTplt,MockTplt} from './js_tplt'
import * as fs from "fs";


export default class JSVisitor extends Vistor {
  moduelID: string;
  demoT:DemoTplt=new DemoTplt()
  methods: Array<object> = new Array<object>();
  funcs: Array<object> = new Array<object>();


  final() {
    const index_js = new IndexTplt()
    index_js.moduelID=this.moduelID
    index_js.methods=this.methods

    fs.stat("./h5/src/mock.js", (exists) => {
            if (exists == null) {
                console.log("file exist! delet it if you want to regenerate")
                return true;
            } else if (exists.code === 'ENOENT') {
                const mock_js = new MockTplt()
                mock_js.methods =this.methods
                mock_js.gen(`./h5/src/mock.js`)
                return false;
            }
        });


    index_js.gen(`./h5/src/index.js`)
    this.demoT.gen(`./h5/src/demo.js`)
    let buttons= this.funcs.map(name=>{
      return `<button class="button-class" onclick="${name}()">${name}</button>`
    });
    let htmlT = new HTMLTplt()
    htmlT.buttons= buttons
    htmlT.gen(`./h5/src/index.html`)
  }

  visitFunc(node: ts.Node) {
    const funcname = node["name"].text;

    const istest  =  funcname.startsWith("test");
    if(istest)
      console.log("founc test --->",funcname)
    

    const arg0 = node["parameters"].length?node["parameters"][0]:null;
    const body = this.extractSRC(node["body"]);
    this.funcs.push(funcname)
    this.demoT.body+=body
  
    if(!istest){
      this.methods.push({
        name: funcname,
        default_args: arg0?eval("(" + this.extractSRC(arg0["initializer"]) + ")"):{},
      });
    }
  }

  visitProperty(node) {}
  visitType(node: ts.Node) {}
  visitClass(node: ts.Node): void {}
  visitNameSpace(node: ts.Node) {
    if (node["name"].text === "moduleID") {
      this.moduelID = node["initializer"].text;
      const splits = this.moduelID.split(".")
      const short_modulename = splits[3]
      this.demoT.modulename=short_modulename
    }
  }
}
