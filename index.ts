#!/usr/bin/env node

function serve(a,b){
  console.log(a,b)
}
require('yargs') // eslint-disable-line
  .command('module', 'module relation', (yargs) => {
    yargs
      .positional('name', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv,1)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })

  .command('device', 'device relation', (yargs) => {
    yargs
      .positional('name', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv,1)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })

  .command('app', 'app relation', (yargs) => {
    yargs
      .positional('name', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv,1)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv
