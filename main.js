// @ts-check
/// <reference path="paths.js" />

const all = [...pop, ...traits, ...origins, ...ethics, ...authority, ...civics]

all.forEach(item => item.initialize())
all.forEach(item => exclude(item))

/**
 * Section templates
 * @typedef Section
 * @property {string} name - the name displayed at the top of the section
 * @property {Item[]} items - items associated with this section
 * @property {References=} references - various data and HTML node references
 * @property {() => boolean} valid - a general check for this section
 * @property {(item: Item) => string} template - template for item's input
 * @property {(() => string)=} details - template for the section details part
 */

/** @type {Section[]} */
const sections = [
  {
    name: 'pop',
    items: pop,
    valid: () => true,
    template: inputTemplate('radio'),
    details: () => `Available: ${1 - empire.pop.length}`,
  },
  {
    name: 'traits',
    items: traits,
    valid: () =>
      empire.traits.length <= 5 && empire.traits.reduce(Trait.costSum, 2) >= 0,
    template: inputTemplate('checkbox'),
    details: () => `
      Available traits:
        <span class="trait-point">${5 - empire.traits.length}</span><br>
      Available points:
        <span class="trait-point">
          ${empire.traits.reduce(Trait.costSum, 2)}
        </span>`,
  },
  {
    name: 'origin',
    items: origins,
    valid: () => empire.origin.length === 1,
    template: inputTemplate('radio'),
    details: () =>
      empire.origin.length === 0 ? 'Select one:' : 'One selected',
  },
  {
    name: 'ethics',
    items: ethics,
    valid: () => empire.ethics.reduce(Ethic.costSum, 3) === 0,
    template: inputTemplate('checkbox'),
    details: () =>
      `Available points: ${empire.ethics.reduce(Ethic.costSum, 3)}`,
  },
  {
    name: 'authority',
    items: authority,
    valid: () => empire.authority.length === 1,
    template: inputTemplate('radio'),
    details: () =>
      empire.authority.length === 0 ? 'Select one:' : 'One selected',
  },
  {
    name: 'civics',
    items: civics,
    valid: () => empire.civics.length === 2,
    template: inputTemplate('checkbox'),
    details: () => `Available: ${2 - empire.civics.length}`,
  },
]

// Initialize the view
renderView()
updateView()
