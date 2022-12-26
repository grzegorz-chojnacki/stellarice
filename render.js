// @ts-check
/// <reference path="paths.js" />

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
 * @property {Entry} entry - Item or rule relevant to handle
 */

/**
 * @typedef Tooltip
 * @property {HTMLElement} handle
 * @property {RuleItem[]} rules - list of rule-item elements
 */

/**
 * @typedef Input
 * @property {HTMLInputElement} handle - Input handle
 * @property {Item} item - Item linked to this input
 * @property {Tooltip} tooltip - Tooltip references
 */

/**
 * @typedef References
 * @property {Summary} summary - Section's summary references
 * @property {Header} header - Section's header references
 * @property {Details} details - Section's details references
 * @property {Input[]} inputs - Section's input references
 */

/**
 * Generates HTML element from text
 * @param {string} html
 * @returns {Element}
 */
const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  if (template.content.children.length === 1)
    return template.content.children[0]
  throw new Error(`HTML template doesn't have only one child`)
}

/**
 * Helper function for setting an HTML flag
 * @param {Element} element
 * @param {string} name - Name of attribute
 * @param {boolean} isEnabled
 */
const setHtmlFlag = (element, name, isEnabled) =>
  isEnabled ? element.setAttribute(name, '') : element.removeAttribute(name)

/**
 * Helper function for setting an HTML class
 * @param {Element} element
 * @param {string} name - CSS class name
 * @param {boolean} isEnabled
 */
const setHtmlClass = (element, name, isEnabled) =>
  isEnabled ? element.classList.add(name) : element.classList.remove(name)

/**
 * HTML input template based on an item
 * @param {'checkbox'|'radio'} type
 * @returns {(item: Item) => string}
 */
const inputTemplate = type => item =>
  `<div>
    <input type="${type}" id="${item.id}">
    <label for="${item.id}">${item.label}</label>
    <div class="tooltip"><ul></ul></div>
  </div>`

/**
 * Add 'pass' HTML attribute to node if its rule is passing
 * @param {Element} node
 * @param {Rule} rule
 */
const updateRule = (node, rule) => setHtmlFlag(node, 'pass', rule.test())

/**
 * Add 'checked' HTML attribute to node if its item is checked
 * @param {Element} node
 * @param {Item} item
 */
const updateRuleItem = (node, item) => {
  setHtmlFlag(node, 'present', item.checked())
  setHtmlClass(node, 'gray', item.disabled())
}

/**
 * Refresh style of an input and its tooltip based on relevant item and rules
 * @param {Input} _
 */
const updateInput = ({ handle, item, tooltip }) => {
  handle.checked = item.checked()
  setHtmlFlag(handle, 'disabled', item.disabled())
  setHtmlFlag(handle, 'invalid', item.invalid())

  tooltip.rules.forEach(({ handle, entry }) => {
    if (entry instanceof Rule) {
      updateRule(handle, entry)
    } else if (entry instanceof Item) {
      updateRuleItem(handle, entry)
    }
  })
}

/**
 * Take list of HTML nodes and apply their order to the DOM
 * @param {Element[]} nodes - list of every element of a common parent element
 */
const sortNodes = nodes =>
  nodes.forEach(node => {
    const container = node.parentNode
    container?.parentNode?.appendChild(container)
  })

/**
 * Update summary based on the items in the empire
 * @param {Summary} _
 */
const updateSummary = ({ handle, items }) => {
  if (items.length === 0) {
    // Pops are biological as a *default*
    const text = items === empire.pop ? 'Biological' : 'Empty'
    handle.replaceChildren(document.createTextNode(text))
    handle.classList.add('comment')
  } else {
    handle.replaceChildren()
    handle.removeAttribute('class')
    items.forEach((item, index, array) => {
      const label = handle.appendChild(document.createElement('label'))
      label.classList.add(getColor(item))
      label.innerText = item.name
      label.setAttribute('for', item.id)
      if (index < array.length - 1) {
        handle.append(', ')
      }
    })
  }
}

/**
 * Sort items of one summary row
 * @param {Summary} row
 */
const sortSummary = row => {
  /** @type {(a: Item, b: Item) => number} */
  const byGetOrder = (a, b) => (getOrder(a) > getOrder(b) ? -1 : 1)

  row.items.sort(Item.compareItems)
  row.items.sort((a, b) => b.cost - a.cost)
  row.items.sort(byGetOrder)
}

/**
 * Sort entries of one section
 * @param {Input[]} inputs
 */
const sortInputs = inputs => {
  /** @param {{ item: Item }} item */
  const disabledLast = ({ item }) => !item.disabled()

  /** @param {{ item: Item }} item */
  const invalidFirst = ({ item }) => item.invalid() && item.checked()

  /** @param {Item[]} list */
  const ofTypeFirst = list => {
    return ({ item }) => list.includes(item)
  }

  /** @type {(a: { item: Item }, b: { item: Item }) => number} */
  const byGetOrder = (a, b) => (getOrder(a.item) > getOrder(b.item) ? -1 : 1)

  inputs.sort((a, b) => a.item.id.localeCompare(b.item.id))

  if (inputs[0].item instanceof Trait) {
    inputs.sort((a, b) => b.item.cost - a.item.cost)
  }

  inputs.sort(byGetOrder)

  // If empire has a certain pop type or authority we need to slighlty alter
  // the grouping so that the related items are close together even if disabled
  if (inputs[0].item instanceof Trait || inputs[0].item instanceof Civic) {
    const fn =
      empire.pop[0]?.id === 'Mechanical'
        ? ofTypeFirst(traitsMechanic)
        : empire.authority[0]?.id === 'Corporate'
        ? ofTypeFirst(civicsCorporate)
        : empire.authority[0]?.id === 'HiveMind'
        ? ofTypeFirst(civicsHive)
        : empire.authority[0]?.id === 'MachineIntelligence'
        ? ofTypeFirst(civicsMachine)
        : null

    if (fn) inputs = partition(inputs, fn).flat()
  }

  inputs = partition(inputs, disabledLast).flat()
  inputs = partition(inputs, invalidFirst).flat()

  sortNodes(inputs.map(({ handle }) => handle))
}

/**
 * Get an arbitrary item order value, which can be used for sorting
 * @param {Item} item
 * @returns {number}
 */
const getOrder = item => {
  if (item instanceof Trait) {
    if (traitsBotanic.includes(item)) return 4
    if (traitsLithoid.includes(item)) return 3
    if (traitsOverturned.includes(item)) return 2
    if (item.cost > 0) return 1
    if (item.cost < 0) return 0
  } else if (item instanceof Ethic) {
    if (item.id.startsWith('Fanatic')) return 2
    if (item.id !== 'Gestalt') return 1
  } else if (item instanceof Civic) {
    if (civicsMachine.includes(item)) return 1
    if (civicsHive.includes(item)) return 2
    if (civicsCorporate.includes(item)) return 3
    if (civicsNormal.includes(item)) return 4
  } else if (item instanceof Authority) {
    return {
      MachineIntelligence: 1,
      HiveMind: 2,
      Corporate: 3,
      Democratic: 4,
      Oligarchic: 5,
      Dictatorial: 6,
      Imperial: 7,
    }[item.id]
  }
  return 0
}

/**
 * Helper function for coloring the item with an arbitrary rules
 * @param {Item} item
 * @returns {string} CSS color class name or `null` for no class
 */
const getColor = item => {
  if (item instanceof Pop) {
    return {
      Botanic: 'botanic',
      Lithoid: 'lithoid',
      Mechanical: 'mechanical',
    }[item.id]
  } else if (item instanceof Trait) {
    if (item.cost < 0) return 'negative'
    if (traitsBotanic.includes(item)) return 'botanic'
    if (traitsLithoid.includes(item)) return 'lithoid'
    if (traitsMechanic.includes(item)) return 'mechanical'
    if (traitsOverturned.includes(item)) return 'overturned'
    if (item.cost > 2) return 'extreme'
    if (item.cost > 0) return 'standard'
    return 'none'
  } else if (item instanceof Origin) {
    return 'standard'
  } else if (item instanceof Ethic) {
    if (item.id.startsWith('Fanatic')) return 'fanatic'
    return 'standard'
  } else if (item instanceof Authority) {
    return {
      Imperial: 'imperial',
      Dictatorial: 'dictatorial',
      Oligarchic: 'oligarchic',
      Democratic: 'democratic',
      Corporate: 'corporate',
      HiveMind: 'hive',
      MachineIntelligence: 'mechanical',
    }[item.id]
  } else if (item instanceof Civic) {
    if (civicsCorporate.includes(item)) return 'corporate'
    if (civicsHive.includes(item)) return 'hive'
    if (civicsMachine.includes(item)) return 'mechanical'
    return 'standard'
  }
  throw new Error(`Couldn't match color for '${item.id}'`)
}

// Update routine, triggered after each input click event
const updateView = () => {
  saveEmpire(empire)
  sections.forEach(section => {
    if (section.references) {
      const { summary, header, details, inputs } = section.references
      sortSummary(summary)
      updateSummary(summary)

      setHtmlClass(header.handle, 'negative', !section.valid())

      details.handle.innerHTML = details.template()

      sortInputs(inputs)
      inputs.map(updateInput)
    }
  })
}

/**
 * Recursively build the HTML tree of rules and attach them to the root
 * @param {HTMLElement} root
 * @param {Rule} rule
 * @returns {RuleItem[]}
 */
const generateTooltipRule = (root, rule) => {
  const handle = root.appendChild(document.createElement('li'))
  handle.classList.add('rule')
  handle.innerText = rule.text
  const ul = root.appendChild(document.createElement('ul'))
  const items = rule.items
    .sort(Item.compareItems)
    .flatMap(item => generateTooltipItem(ul, item))

  const rules = rule.rules.flatMap(rule => generateTooltipRule(ul, rule))

  return [{ handle, entry: rule }, ...rules, ...items]
}

/**
 * Construct the HTML item representation and attach to the root
 * @param {HTMLElement} root
 * @param {Item} item
 * @returns {RuleItem[]}
 */
const generateTooltipItem = (root, item) => {
  const handle = root.appendChild(document.createElement('li'))
  handle.classList.add('rule-item')
  handle.innerText = item.fullName
  return [{ handle, entry: item }]
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
  const tooltip = element.getElementsByTagName('ul')[0]

  element.classList.add(getColor(item))

  handle.onclick = () => {
    toggleIncluded(items, item)
    updateView()
  }

  const tooltipExclusive = generateTooltipRule(tooltip, item.exclusive)
  tooltipExclusive.forEach(t => t.handle.classList.add('exclusive'))

  const tooltipRule = generateTooltipRule(tooltip, item.rule)

  inputContainer.appendChild(element)
  return {
    item,
    handle,
    tooltip: {
      handle: tooltip,
      rules: tooltipExclusive.concat(tooltipRule),
    },
  }
}

/** @param {string} [name] */
const generateResetButton = name => {
  const button = document.createElement('button')
  button.innerText = 'reset'
  button.classList.add('reset-button')

  button.onclick = () => {
    name ? clear(empire[name]) : Object.values(empire).forEach(clear)
    updateView()
  }

  return button
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
  row.appendChild(document.createElement('th')).append(capitalize(name + ':'))
  const root = options.appendChild(document.createElement('section'))
  const header = root.appendChild(document.createElement('h2'))
  header.innerHTML = capitalize(name)
  header.appendChild(generateResetButton(name))

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
    const bebo = summary.appendChild(document.createElement('h2'))
    bebo.append('Empire summary')
    bebo.appendChild(generateResetButton())
    const table = summary.appendChild(document.createElement('table'))

    sections.forEach(renderSection(options, table))
  }
}
