// @ts-check
/// <reference path="paths.js" />

const all = [...pop, ...traits, ...origins, ...ethics, ...authority, ...civics]

all.forEach(item => item.rule = cookRule(item.rawRule, all))
all.forEach(item => item.clean())
// all.forEach(doubleBindNone)

/**
 * Section templates
 * @typedef Section
 * @property {string} name - the name displayed at the top of the section
 * @property {Item[]} items - items associated with this section
 * @property {References=} references - Various data and HTML node references
 * @property {(item: Item) => string} template - Template for item's input
 * @property {(() => string)=} details - Template for the section details part
 */

/** @type {Section[]} */
const sections = [
  {
    name: 'pop',
    items: pop,
    template: inputTemplate('radio'),
  },
  {
    name: 'traits',
    items: traits,
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
    template: inputTemplate('radio'),
  },
  {
    name: 'ethics',
    items: ethics,
    template: inputTemplate('checkbox'),
  },
  {
    name: 'authority',
    items: authority,
    template: inputTemplate('radio'),
  },
  {
    name: 'civics',
    items: civics,
    template: inputTemplate('checkbox'),
    details: () => `Available civics: ${2 - empire.civics.length}`,
  },
]

// Initialize the view
renderView()
updateView()
