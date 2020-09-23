const { exec } = require("child_process");

function run(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}


run("cd ../../ && coge x-engine-module-template xxxx:dcloud @:x-engine-module-dcloud -w");
//run("pwd");

console.log("preinstall...");

// Print out the name of the package that was just installed.
console.log("    " + process.env.npm_package_name);

// Print out the directory of the package that was just installed.
console.log("    " + process.env.PWD);
