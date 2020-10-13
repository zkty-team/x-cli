import { run }  from "./util";

export let app= {
  init:(appname:string)=>{
      //run(`git clone  https://github.com/zkty-team/x-engine-app-template xxxx:${appname} @:${appname} -w`);
      run(`coge x-engine-app-template xxxx:${appname} @:${appname} -w`);
    }
}


