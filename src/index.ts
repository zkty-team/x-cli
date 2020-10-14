#!/usr/bin/env node

const {app} = require('./app')
const {modules} = require('./modules')
const {model} = require('./model')
const { program } = require('commander');


program
  .command('app')
  .description('app relation')
  .action((opts) => {
    let args = opts.args
    console.log(args)
    if(args && args.length==1) {
      app.init(args[0])
    }
  });

program
  .command('module')
  .description('module relation')
  .action((opts) => {
    let args = opts.args
    console.log(args)

    if(args && args.length==1) {
        modules.autolink() 
    }
    else if(args && args.length==2) {
        modules.init(args.pop()) 
    }

  });

program
  .command('model', { isDefault: true })
  .description('model relation')
  .option('-p,--platform <platform>', 'generate code for specified platform','ios')
  .action((opts) => {
    let args = opts.args
    console.log(args)
    if(args && args.length==1) {
      model.parse(args[0])
    }
  });

program.parse(process.argv);

