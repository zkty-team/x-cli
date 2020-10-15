
let {readFileSync} = require("fs")
import * as ts from "typescript";
import JAVAVisitor from "./java_visitor";
import JSVisitor from "./js_visitor";
import OCVisitor from "./oc_visitor";
import ReadmeVisitor from "./readme_visitor";
import ConfigVisitor from "./config_visitor"

export let model = {
  parse:(modelpath)=>{
      const sourceFile = ts.createSourceFile(
        modelpath,
        readFileSync(modelpath).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ false
      );
    console.log("parsing...")
    new OCVisitor().parse(sourceFile);
    new JAVAVisitor().parse(sourceFile);
    new JSVisitor().parse(sourceFile);
    new ReadmeVisitor().parse(sourceFile);
    //new ConfigVisitor().parse(sourceFile);

  }
}

