
import {warning} from './util'
import {Tplt,Arg} from './Tplt'
import {isFunction, isObject, isNumber} from 'util';

export class APITplt extends Tplt{
  comment:string;
  args: Array<Arg>=[];
  funcname:string;
  democode: string;
  ret:any;
  setdefault(default_obj:any){
  if(default_obj)     
  {
    Object.keys(default_obj).forEach(key=>{
      for(let i = 0; i < this.args.length; i++){
      console.log(this.args[i],key)
        if(this.args[i].name === key){
          let val  = default_obj[key]
          let str  = ""
          if(isFunction(val)){
            str = val.toString();
            str=str.replace('\n','\\n');
          } else if(isObject(val)){
            str = JSON.stringify(default_obj[key]);
            str=str.replace('\n','\\n');
          } else{
            str = default_obj[key];
          }
          this.args[i].default_value=str;
        }
      }
    })
  }
  }

  finalize(){
    const header =`
| name                        | type      | optional | default   | comment  |
| --------------------------- | --------- | -------- | --------- |--------- |`
    const tmplt = `
## ${this.funcname}

${this.comment?this.comment:""}

	
${this.args.length?"**参数说明**":"**无参数**"}
${this.args.length?header:""}
${this.args.length?this.args.map(arg=>arg.finalize()).join("\n"):""}
`
    return tmplt
  }
//${this.democode?"\`\`\` js\n"+this.democode+"\n\`\`\` \n":""}
}

export class ReadmeTplt extends Tplt {
  namespace: string;
  apis : Array<APITplt>=[];

  finalize(){
    console.log("hello",this.namespace)
    return `
\`
${this.namespace}
\`


${this.apis.map(e=>e.finalize()).join("\n")}
    `
  }

  gen(path:string){
    this.gen_content(path+`/readme.md`,this.finalize())
  }
}
