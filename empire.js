// @ts-check
/// <reference path="paths.js" />


/**
 * The empire structure, used for keeping the state of which item is checked
 * @typedef Empire
 * @property {Pop[]} pop
 * @property {Trait[]} traits
 * @property {Origin[]} origin
 * @property {Ethic[]} ethics
 * @property {Authority[]} authority
 * @property {Civic[]} civics
 */

/** @type {Empire} */
const empire = {
  pop: [],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}

const loadEmpire = () => {
  /** @type {{ [x: string]: string[] } | null} */
  const preset = JSON.parse(localStorage.getItem('empire') || 'null')
  if (preset) {
    Object.entries(preset).forEach(([key, ids]) => {
      empire[key].push(...ids.map(id => getItemById(all, id)))
    })
  }
}

/** @param {Empire} empire */
const saveEmpire = empire => {
  const preset = Object.entries(empire).reduce((acc, [key, items]) => {
    acc[key] = items.map(item => item.id)
    return acc
  }, {})
  localStorage.setItem('empire', JSON.stringify(preset))
}

/**
 * Randomly generate new empire
 * @param {Empire} empire
 */
const randomize = empire => {
  /** @type {<T extends Item>(arr: T[]) => T} */
  const randomCheckable = arr => choice(arr.filter(a => a.checkable()))

  Object.values(empire).forEach(clear)

  if (Math.random() <= 0.4) {
    empire.pop.push(randomCheckable(pop))
  }

  while (empire.ethics.reduce(Ethic.costSum, 3) > 0) {
    empire.ethics.push(randomCheckable(ethics))
  }

  empire.authority.push(randomCheckable(authority))

  empire.origin.push(randomCheckable(origins))

  while (empire.civics.length < 2) {
    empire.civics.push(randomCheckable(civics))
  }

  /** @type {(arr: Trait[]) => void} */
  const removeRandomTrait = arr => {
    removeAt(empire.traits, empire.traits.indexOf(choice(arr)))
  }

  while (true) {
    const points = empire.traits.reduce(Trait.costSum, 2)

    const negativeChecked = empire.traits.filter(t => t.cost < 0)
    const positiveChecked = empire.traits.filter(t => t.cost > 0)
    const positiveCheckable = traits.filter(t => t.checkable() && t.cost > 0)
    const negativeCheckable = traits.filter(t => t.checkable() && t.cost < 0)

    if (points === 0) {
      // End randomization early if traits are balanced
      if (Math.random() <= (0.2 * empire.traits.length)) break
    }

    if (points >= 0)  {
      if (empire.traits.length === 5) {
        removeRandomTrait(negativeChecked)
      } else {
        if (positiveCheckable.length > 0) {
          empire.traits.push(choice(positiveCheckable))
        }
      }
    } else if (points < 0) {
      if (empire.traits.length === 5) {
        removeRandomTrait(positiveChecked)
      } else {
        if (negativeCheckable.length > 0) {
          empire.traits.push(choice(negativeCheckable))
        }
      }
    } else {
      console.warn('Something went wrong during trait randomization')
      break
    }
  }
}
