import { exec } from 'child_process'
import { writeFile } from 'fs'
import chalk from 'chalk'
import path from 'path'
import config from '../../cSpell.json'
import readline from 'readline'

export async function checkFiles() {
  checkSpelling('files').catch((unknownWords: string[]) => {
    console.log(
      chalk.red(
        'Files contain unknown word(s).'),
        "Let's go ever them one by one:"
    )
    askToAdd(unknownWords)
  })
}

/**
 * Checks spelling of all the files or the commit message.
 *
 * If no unknown words found resolves the returned promise with undefined.
 *
 * If unknown words were found - rejects the returned promise with an array of
 * unknown words. Unfortunately rejected promise can't be typed, because it can
 * be rejected due to any error, and those errors are impossible to foresee,
 * it's a JS limitation that TS can't overcome.
 */
export function checkSpelling(whatToCheck: 'message' | 'files') {
  const files = whatToCheck === 'message' ? '$HUSKY_GIT_PARAMS' : '*'
  const command = `npx cspell ${files} -u --wordsOnly --no-summary`
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error && stdout) {
        const words = extractWords(stdout)
        console.log(
          chalk.red(
            `Spell checker found ${words.length} unknown word(s):`,
            words.join(', ')
          )
        )
        reject(words)
      }

      if (stderr) {
        console.error(chalk.red('cspell error:', stderr))
        reject(null)
        return
      }

      chalk.green(`The ${whatToCheck} spell check passed.`)
      resolve()
    })
  })
}

/**
 * Extracts unknown words from cSpell CLI output. Make sure cSpell is given
 * --wordsOnly --no-summary params.
 * TODO: consider using underlying JS lib directly
 */
function extractWords(output: string) {
  return output.match(/\w+/g) ?? []
}

/**
 * Returns a resolved promise if all unknown words were added to the dictionary,
 * and rejected otherwise.
 */
export function askToAdd(words: string[]) {
  return new Promise((resolve, reject) => {
    if (words.length === 0) {
      resolve()
      return
    }
    console.log("Let's go over the unknown words one by one.")
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    let addedCount = 0
    words.forEach(word => {
      rl.question(
        `Would you like to add "${word}" to the list of known words in cSpell.json? (y)es/no`,
        (answer) => {
          if (['yes', 'y'].includes(answer.toLowerCase())) {
            rl.pause()
            add(word)
            addedCount++
          }
        }
      )
    })
    rl.close()
    words.length - addedCount > 0 ? reject() : resolve()
  })
}

function add(word: string, destination = './cSpell.json') {
  return new Promise((resolve, reject) => {
    const updatedWords = [...config.words, word].sort()
    const prettyJSON = JSON.stringify(
      { ...config, words: updatedWords },
      null,
      2
    )
    writeFile(destination, prettyJSON, (err) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      console.log(
        chalk.green('✔ Added', `"${word}"`, 'to', path.resolve(destination))
      )
      resolve()
    })
  })
}
