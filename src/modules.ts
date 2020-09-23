const { run } = require("./util");

module.exports = {
    modules:(args)=>{
      console.log("modules called",args)
      run(`coge x-engine-module-template xxxx:${args.name} @:x-engine-module-${args.name} -w`);
    }
}




