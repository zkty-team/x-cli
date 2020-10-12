import { run }  from "./util";

export let app= {
  init:(args)=>{
      console.log("modules called",args)
      let appname:string = args['_'].pop()
      run(`coge x-engine-module-template xxxx:${appname} @:${appname} -w`);
    }
}


