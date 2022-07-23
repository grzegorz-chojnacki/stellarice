// @ts-check
/// <reference path="paths.js" />

const all = [...pop, ...traits, ...origins, ...ethics, ...authority, ...civics]
all.forEach(item => injectItems(all, item.rule))

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

/**
 * @typedef Summary
 * @property {HTMLElement} handle - Section's summary table row
 * @property {Item[]} items - Empire list of items related to this summary row
 */

/**
 * @typedef Header
 * @property {HTMLElement} handle - Section's header
 * @property {Item[]} items - List of all items related to this section
 */

/**
 * @typedef Details
 * @property {HTMLElement} handle - the main HTML element reference
 * @property {() => string} template - Details template
 */

/**
 * @typedef RuleItem
 * @property {HTMLElement} handle - Tooltip's <li> or <span> element
 * @property {Rule|Item} x - Item or rule relevant to handle
 */

/**
 * @typedef Tooltip
 * @property {HTMLElement} handle
 * @property {RuleItem[]} rules - list of rule-item elements
 */

/**
 * @typedef Input
 * @property {HTMLInputElement} handle - Input handle
 * @property {Item} item = Item linked to this input
 * @property {Tooltip} tooltip = Tooltip references
 */

/**
 * @typedef References
 * @property {Summary} summary - Section's summary references
 * @property {Header} header - Section's header references
 * @property {Details} details - Section's details references
 * @property {Input[]} inputs - Section's input references
 */

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

// Update routine, triggered after each input click event
const updateView = () => {
  sections.forEach(section => {
    if (section.references) {
      const { summary, header, details, inputs } = section.references
      sortSummary(summary)
      updateSummary(summary)

      updateHeader(header)

      details.handle.innerHTML = details.template()

      sortInputs(inputs)
      inputs.map(updateInput)
    }
  })
}

/**
 * Create an input and its label for a given item, return references
 * @param {Item[]} items - Relevant empire item list
 * @param {HTMLElement} inputContainer - Element with inputs
 * @param {(item: Item) => string} template - Item's input template
 * @returns {(item: Item) => Input}
 */
const renderInputs = (items, inputContainer, template) => item => {
  const element = htmlToElement(template(item))
  const handle = element.getElementsByTagName('input')[0]
  const tooltip = element.getElementsByTagName('div')[0]

  element.classList.add(getColor(item))

  handle.onclick = () => {
    toggleIncluded(items, item)
    updateView()
  }

  inputContainer.appendChild(element)
  return {
    item,
    handle,
    tooltip: {
      handle: tooltip,
      rules: generateTooltipRules(tooltip, item.rule),
    },
  }
}

// Create a section, return its references
/**
 *
 * @param {Element} options - Options node
 * @param {HTMLTableElement} table - Summary table node
 * @returns
 */
const renderSection = (options, table) => section => {
  const { name, items, template, details = () => '' } = section

  const row = table.insertRow()
  row.appendChild(document.createElement('th')).append(capitalize(name))
  const root = options.appendChild(document.createElement('section'))
  const header = root.appendChild(document.createElement('h2'))
  header.innerHTML = capitalize(name)

  const handle = root.appendChild(document.createElement('div'))
  const inputList = root.appendChild(document.createElement('div'))
  inputList.classList.add('input-list')

  const inputs = items.map(renderInputs(empire[name], inputList, template))

  section.references = {
    summary: { handle: row.insertCell(), items: empire[name] },
    header: { handle: header, items },
    details: { handle, template: details },
    inputs,
  }
}

// Create empire summary and all sections
const renderView = () => {
  const summary = document.getElementById('summary')
  const options = document.getElementById('options')

  if (summary && options) {
    summary.appendChild(document.createElement('h2')).append('Empire summary')
    const table = summary.appendChild(document.createElement('table'))

    sections.forEach(renderSection(options, table))
  }
}

// Initialize the view
renderView()
updateView()
