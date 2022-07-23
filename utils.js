// @ts-check
/// <reference path="paths.js" />

/**
 * Helper partition function
 * @template T
 * @param {T[]} arr - array of elements to partition
 * @param {(value: T) => boolean} fn - predicate for partitioning
 * @return {[T[], T[]]}
 */
const partition = (arr, fn) =>
  arr.reduce(
    ([a, b], x) => (fn(x) ? [a.concat(x), b] : [a, b.concat(x)]),
    /** @type {[T[], T[]]} */ ([[], []])
  )

/**
 * Sort rules/items alphabetically, hoist items to the top
 * @param {RawEntry[]} entries
 * @returns {Entry[]}
 */
const sortEntries = entries => {
  const [items, rules] =
    /** @type {[Item[], Rule[]]} */
    (partition(entries, x => x instanceof Item))

  items.sort((a, b) => a.fullName.localeCompare(b.fullName))
  return [...items, ...rules]
}

/**
 * Helper function for getting item by id from all items
 * @param {Item[]} arr
 * @param {string} id
 * @returns {Item}
 */
const getItemById = (arr, id) => {
  const item = arr.find(item => item.id === id)
  if (!item) throw new Error(`Couldn't find '${id}'!`)
  return item
}

/**
 * Recursively inject rule with item references in place of ids
 * @param {Item[]} items - list of all items
 * @param {Rule} rule - rule to inject with item references
 */
const injectItems = (items, rule) => {
  rule.entries = rule.entries.map(entry => {
    if (typeof entry === 'string') return getItemById(items, entry)
    if (entry instanceof Rule) {
      injectItems(items, entry)
    }
    return entry
  })
  return rule
}

/**
 * Generate list of unique pairs (combinations of 2 elements)
 * @template T
 * @param {T[]} arr
 */
const pairs = arr => arr.flatMap((v, i) => arr.slice(i + 1).map(w => [v, w]))

/**
 * Recursively go through rules and simplify them
 * @param {Rule} rule - rule to inject with item references
 */
const mergeRules = rule => {
  rule.entries.forEach(entry => {
    if (entry instanceof Rule) mergeRules(entry)
  })

  pairs(rule.entries).forEach(([a, b]) => {
    if (typeof a === 'string' || typeof b === 'string') return
    if (a instanceof Item || b instanceof Item) return
    if (a.constructor === Some) return
    if (b.constructor === Some) return
    if (a.constructor === b.constructor) {
      a.entries = a.entries.concat(b.entries)
      rule.entries.splice(rule.entries.findIndex(e => e === b), 1)
    }
  })
}

/**
 * Insert item to the list if it is not already included, remove it if found
 * @param {Item[]} list
 * @param {Item} item
 */
const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

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
 * Capitalize string
 * @type {(str: string) => string}
 */
const capitalize = str => str[0].toUpperCase() + str.slice(1)

/**
 * Make certain words lowercase
 * @type {(str: string) => string}
 */
const decapitalize = str =>
  str.replace(/\b(to|be|the|of)\b/gi, x => x.toLowerCase())

/**
 * Insert spaces before uppercase words
 * @type {(str: string) => string}
 */
const spacify = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

/**
 * Convert PascalCase to normal wording, with specific capitalization rules
 * @type {(str: string) => string}
 */
const prettify = str => decapitalize(capitalize(spacify(str)))

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
    <div class="tooltip"></div>
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
const updateRuleItem = (node, item) =>
  setHtmlFlag(node, 'present', item.checked())

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
 * Color the section header when general rule of its items is not passing
 * @param {Header} _
 */
const updateHeader = ({ handle, items }) => {
  setHtmlClass(
    handle,
    'cranberry',
    items.some(item => !item.generalRule())
  )
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
 * Update summary entries based on the items in the empire
 * @param {Summary} _
 */
const updateSummary = ({ handle, items }) => {
  if (items.length === 0) {
    const text = items === empire.pop ? 'Biological' : 'Empty'
    handle.replaceChildren(document.createTextNode(text))
    handle.classList.add('comment')
  } else {
    handle.replaceChildren()
    handle.removeAttribute('class')
    items.forEach(item => {
      const label = handle.appendChild(document.createElement('label'))
      label.classList.add(getColor(item))
      label.innerText = item.name
      label.setAttribute('for', item.id)
      handle.append(', ')
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

  row.items.sort((a, b) => a.id.localeCompare(b.id))
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

  /** @type {(a: { item: Item }, b: { item: Item }) => number} */
  const byGetOrder = (a, b) => (getOrder(a.item) > getOrder(b.item) ? -1 : 1)

  inputs.sort((a, b) => a.item.id.localeCompare(b.item.id))

  if (inputs[0].item instanceof Trait) {
    inputs.sort((a, b) => b.item.cost - a.item.cost)
  }

  inputs.sort(byGetOrder)
  inputs = partition(inputs, disabledLast).flatMap(x => x)
  inputs = partition(inputs, invalidFirst).flatMap(x => x)

  sortNodes(inputs.map(({ handle }) => handle))
}

/**
 * Get an arbitrary item order value, which can be used for sorting
 * @param {Item} item
 * @returns {number}
 */
const getOrder = item => {
  if (item instanceof Trait) {
    if (traitsOrigin.includes(item)) return 4
    if (traitsBotanic.includes(item)) return 3
    if (traitsLithoid.includes(item)) return 2
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
 * Recursively build the HTML tree of rules and attach them to root
 * @param {HTMLElement} root
 * @param {Entry} entry
 * @returns {RuleItem[]}
 */
const generateTooltipRules = (root, entry) => {
  if (entry instanceof Item) {
    const handle = root.appendChild(document.createElement('li'))
    handle.classList.add('rule-item')
    handle.innerText = entry.fullName
    return [{ handle, entry }]
  } else {
    const handle = root.appendChild(document.createElement('span'))
    handle.classList.add('rule')
    handle.innerText = entry.text
    const ul = root.appendChild(document.createElement('ul'))
    const rules = sortEntries(entry.entries).flatMap(y =>
      generateTooltipRules(ul, y)
    )
    return rules.concat({ handle, entry })
  }
}

/**
 * Helper function for coloring the item with an arbitrary rules
 * @param {Item} item
 * @returns {string} CSS color class name or `null` for no class
 */
const getColor = item => {
  if (item instanceof Pop) {
    return {
      Botanic: 'rosebud',
      Lithoid: 'apricot',
      Mechanical: 'turquoise',
    }[item.id]
  } else if (item instanceof Trait) {
    if (traitsBotanic.includes(item)) return 'rosebud'
    if (traitsLithoid.includes(item)) return 'apricot'
    if (item.cost > 0) return 'turquoise'
    if (item.cost < 0) return 'cranberry'
    return 'none'
  } else if (item instanceof Origin) {
    return 'tacao'
  } else if (item instanceof Ethic) {
    if (item.id.startsWith('Fanatic')) return 'cranberry'
    if (item.id.startsWith('Gestalt')) return 'tacao'
    return 'apricot'
  } else if (item instanceof Authority) {
    return {
      Imperial: 'cranberry',
      Dictatorial: 'apricot',
      Oligarchic: 'rosebud',
      Democratic: 'tacao',
      Corporate: 'tacao',
      HiveMind: 'lavender',
      MachineIntelligence: 'turquoise',
    }[item.id]
  } else if (item instanceof Civic) {
    if (civicsCorporate.includes(item)) return 'rosebud'
    if (civicsHive.includes(item)) return 'lavender'
    if (civicsMachine.includes(item)) return 'turquoise'
    return 'apricot'
  }
  throw new Error(`Couldn't match color for '${item.id}'`)
}
