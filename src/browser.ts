//// <reference lib="dom" />

import {greet} from './lib'

const element = document.getElementById('ts')
if (element) {
  element.innerText = greet('John')
}