
let {readFileSync} = require("fs")
import * as ts from "typescript";
import JAVAVisitor from "./java_visitor";
import JSVisitor from "./js_visitor";
import OCVisitor from "./oc_visitor";
import ReadmeVisitor from "./readme_visitor";

export let model = {
  parse:(args)=>{
      let fileName = args.name  
      const sourceFile = ts.createSourceFile(
        fileName,
        readFileSync(fileName).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ false
      );
    console.log("parsing...")
    new OCVisitor().parse(sourceFile);
    new JAVAVisitor().parse(sourceFile);
    new JSVisitor().parse(sourceFile);
    new ReadmeVisitor().parse(sourceFile);

  }
}

