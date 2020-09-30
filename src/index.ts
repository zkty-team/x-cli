#!/usr/bin/env node

const {app} = require('./app')
const {modules} = require('./modules')
const {model} = require('./model')
const { program } = require('commander');


program
  .command('app')
  .description('app relation')
  .action(() => {
    console.log('app');
  });

program
  .command('module')
  .description('module relation')
  .action(() => {
     modules.autolink() 
  });

program
  .command('model', { isDefault: true })
  .description('model relation')
  .option('-p,--platform <platform>', 'generate code for specified platform','ios')
  .action((opts) => {
    let args = opts.args

    if(args && args.length==1) {
      model.parse(args[0])
    }
  });

program.parse(process.argv);

