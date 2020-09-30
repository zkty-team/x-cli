import { run } from "./util";
import * as fs from "fs";
const path = require("path");
const npm = require("npm");
const fse = require("fs-extra");

export let modules = {
  install: (args) => {
    console.log("modules install called", args.modulename);
  },
  autolink: () => {
    function filterName(data, name) {
      if (!data) return;
      let deps = data["dependencies"];
      if (!deps) return;
      return Object.keys(deps).filter((k) => {
        return k.startsWith(name);
      });
    }

    function genRB(path, deps) {
      function line(name) {
        return `pod '${name
          .split("/")
          .pop()}', :path =>'../node_modules/${name}'`;
      }
      let tmplt = `
require "json"
def module_pods
  ${deps.map((m) => line(m)).join("\n  ")}
  
end
  `;
      fse.outputFile(path, tmplt, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${path}  was saved!`);
        }
      });
    }

    run("npm ls --dpeth=0 --json --prod", (result) => {
      let jdata = JSON.parse(result);
      let jdata2 = filterName(jdata, "@zkty-team");

      let path = "iOS/ModulePods.rb";
      console.log(jdata2);
      genRB(path, jdata2);

      fs.stat("./iOS/Podfile", (exists) => {
              if (exists == null) {
                  run("cd iOS && pod install", (result) => {
                    console.log(result);
                  });
                  return true;
              } else if (exists.code === 'ENOENT') {
                  console.log("./iOS/Podfile not exist!")
                  return false;
              }
          });
    });
  },
};
