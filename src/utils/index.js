import relics from '../data/relics'
import planars from '../data/planars'
import characters from '../data/characters'

const getRelic = (id) => relics.find(relic => relic.id == id)
const getPlanar = (id) => planars.find(planar => planar.id == id)
const getChar = (id) => characters.find(char => char.id == id)

const groupStats = (statCharPairs) => {
  const statCharGroup = Object.groupBy(statCharPairs, pair => pair[0])

  let stats = []
  for (const stat in statCharGroup) {
    let chars = []
    for (const statCharPair of statCharGroup[stat]) {
      chars.push(getChar(statCharPair[1]))
    }

    stats.push({
      stat: stat,
      chars: chars,
    })
  }

  return stats.sort((a, b) => {
    if (a.chars.length < b.chars.length) {
      return 1
    } else if (a.chars.length > b.chars.length) {
      return -1
    } else {
      return 0
    }
  })
}

export {
  getRelic,
  getPlanar,
  getChar,
  groupStats,
}