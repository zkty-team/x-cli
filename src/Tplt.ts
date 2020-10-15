const fse = require("fs-extra");
export  abstract class Tplt {
  abstract finalize(): string;
  gen(path) {
    fse.outputFile(path, this.finalize(), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${path}  was saved!`);
      }
    });
  }
  gen_content(path,content) {
    fse.outputFile(path, content, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${path}  was saved!`);
      }
    });
  }
}
export class Arg extends Tplt {

  type:    string;
  name:    string;
  optional:boolean;
  default_value: string=""
  comment: string;
  finalize(){
    if(this.name.startsWith("__")){
      this.name=this.name.replace(/_/g, '\\_');
    }
    const tmplt =
`| ${this.name?this.name:""} | ${this.type?this.type:""} | ${this.optional?this.optional:""} | ${this.default_value?this.default_value:""} | ${this.comment?this.comment:""} |`
    return tmplt
  }
}
