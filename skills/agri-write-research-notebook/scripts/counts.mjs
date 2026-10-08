import { randomInt } from 'node:crypto'

const firstLevel = randomInt(3, 5)

console.log(JSON.stringify({
  first_level: firstLevel,
  second_level: Array.from({ length: firstLevel }, () => randomInt(2, 5)),
}))
