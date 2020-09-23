#!/usr/bin/env node

let {app} = require('./app')
let {modules} = require('./modules')

require('yargs') // eslint-disable-line
  .command('app', 'app relation', (yargs) => {
    yargs
    .positional('name', { describe: 'port to bind on', default: 5000 }) }, 
    (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        app(argv)
  })
  .option('verbose', { alias: 'v', type: 'boolean', description: 'Run with verbose logging' })

  .command('modules', 'modules relation', (yargs) => {
    yargs.positional('name', { describe: 'port to bind on', default: 5000 }) }, 
    (argv) => {
        modules(argv)
  })
  .argv
