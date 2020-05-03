#!/usr/bin/env ts-node-script
import chalk from 'chalk'
import {checkSpelling, askToAdd} from './code-spell'

checkSpelling('message').catch((unknownWords: string[]) => {
  console.log(chalk.red('The commit message contains unknown word(s).'))
  askToAdd(unknownWords)
    // if not all words were added, we can't allow to commit
    .catch(() => process.exit(1))
})