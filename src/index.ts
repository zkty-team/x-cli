#!/usr/bin/env node

let {app} = require('./app')
let {modules} = require('./modules')
let {model} = require('./model')

require('yargs') // eslint-disable-line
  .command('app', 'app relation', (yargs) => {
    yargs
    .positional('name', { describe: 'port to bind on', default: 'app' }) }, 
    (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        app.init(argv)
  })
  .option('verbose', { alias: 'v', type: 'boolean', description: 'Run with verbose logging' })

  .command(
           'module', 
           'module relation', 
           (yargs) => {
              yargs.command('install [modulename]', 'isntall module with npm , pod, gralde', (yargs) => {}, (argv) => { modules.install(argv) })
              yargs.positional('name', { describe: 'port to bind on', default: 5000 }) 
           }, 
           (argv) => { modules.autolink(argv) }
  )
  .command(
           'model', 
           'model relation', 
           (yargs) => {yargs.positional('name', { describe: 'port to bind on', default: 'model.ts' }) }, 
           (argv) => { model.parse(argv)}
  )
  .argv
