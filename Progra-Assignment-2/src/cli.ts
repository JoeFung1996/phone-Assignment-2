const argv = require('yargs/yargs')(process.argv.slice(2))
  .options({
    input: { type: 'string', demandOption: true },
    output: { type: 'string', demandOption: true },
    format: { type: 'string', choices: ['json', 'text'], default: 'json' }
  })
  .argv;