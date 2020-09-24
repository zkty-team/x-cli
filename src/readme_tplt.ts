
import {warning} from './util'
import {Tplt,Arg} from './Tplt'

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
        if(this.args[i].name === key){
          this.args[i].default_value=JSON.stringify(default_obj[key]);
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
