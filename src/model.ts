
let {readFileSync} = require("fs")
import * as ts from "typescript";
import JSVisitor from "./js_visitor";

module.exports={
  parse:(args)=>{
      let fileName = args.name  
      const sourceFile = ts.createSourceFile(
        fileName,
        readFileSync(fileName).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ false
      );
      new JSVisitor().parse(sourceFile);
      //console.log(new JSVisitor())

  }
}

