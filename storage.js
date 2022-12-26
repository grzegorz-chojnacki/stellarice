// @ts-check
/// <reference path="paths.js" />

const loadEmpire = () => {
  /** @type {{ [x: string]: string[] } | null} */
  const preset = JSON.parse(localStorage.getItem('empire') || 'null')
  if (preset) {
    Object.entries(preset).forEach(([key, ids]) => {
      empire[key].push(...ids.map(id => getItemById(all, id)))
    })
  }
}

/** @param {{ [x: string]: Item[] }} empire */
const saveEmpire = empire => {
  const preset = Object.entries(empire).reduce((acc, [key, items]) => {
    acc[key] = items.map(item => item.id)
    return acc
  }, {})
  localStorage.setItem('empire', JSON.stringify(preset))
}

/**
 * The empire structure, used for keeping the state of which item is checked
 * @type {{ [x: string]: Item[] }}
 */
const empire = {
  pop: [],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}
