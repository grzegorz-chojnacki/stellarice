// Helper partition function
const partition = (arr, fn) =>
  arr.reduce(
    ([a, b], x) => (fn(x) ? [a.concat(x), b] : [a, b.concat(x)]),
    [[], []]
  )

// Sort items depending on arbitrary rules
const sortItems = items => {
  // Place disabled as last
  items = [...partition(items, x => !x.disabled()).flatMap(x => x)]
  // Place checked & invalid as first
  items = [...partition(items, x => x.invalid() && x.checked()).flatMap(x => x)]
  return items
}

// Sort rules alphabetically and hoist single items to the top
const sortRules = rule => {
  if (rule.items) {
    const [items, rules] = partition(rule.items, x => x instanceof Item)
    items.sort((a, b) => a.fullName.localeCompare(b.fullName))
    return [...items, ...sortRules(rules)]
  } else return rule
}

// Helper function for getting item by id from all items
const getItemById = id => {
  const item = all.find(item => item.id === id)
  if (!item) throw new Error(`Couldn't find '${id}'!`)
  return item
}

// Recursively inject items, essentialy replacing their id's to themselves
//   - When passed an item id, it will get the item and return it
//   - When passed a rule object it will return it back with injected items
const injectItems = x => {
  if (!x) return x
  if (x instanceof Item) return x
  if (typeof x === 'string') return getItemById(x)
  if (x instanceof Rule) {
    x.items = x.items.map(injectItems)
    return x
  }
  return x
}

// Insert or remove item from list
const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

// Generates HTML element from text
const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

// String helper functions
const capitalize = str => str[0].toUpperCase() + str.slice(1)
const decapitalize = str =>
  str.replace(/\b(to|be|the|of)\b/gi, x => x.toLowerCase())
const spacify = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

// Convert PascalCase to normal wording, with specific capitalization rules
const prettify = str => decapitalize(capitalize(spacify(str)))

// Helper function for setting an HTML flag
const setHtmlFlag = (element, name, isEnabled) =>
  isEnabled ? element.setAttribute(name, '') : element.removeAttribute(name)

const setHtmlClass = (element, name, isEnabled) =>
  isEnabled ? element.classList.add(name) : element.classList.remove(name)

const sectionTemplate = inputType => item =>
  `<div>
    <input type="${inputType}" id="${item.id}" name="${item.id}">
    <label for="${item.id}">${item.label}</label>
    <div class="tooltip"></div>
  </div>`

// Entry template
const entryTemplate = item => `
  <span>
    <label for="${item.id}">${item.name}</label>,
    <div class="tooltip"></div>
  </span>`

const updateDetails = ({ handle, fn }) => (handle.innerHTML = fn())

const updateRuleLi = (li, item) => setHtmlFlag(li, 'present', item.checked())
const updateRuleSpan = (span, item) => {
  const value = item.rule.test()
  setHtmlFlag(span, 'pass', value)
  setHtmlFlag(span, 'fail', !value)
}

const updateInput = ({ input, item, rules }) => {
  input.checked = item.checked()
  setHtmlFlag(input, 'disabled', item.disabled())
  setHtmlFlag(input, 'invalid', item.invalid())

  rules.forEach(({ handle, x }) => {
    if (x instanceof Rule) {
      updateRuleSpan(handle, item)
    } else if (x instanceof Item) {
      updateRuleLi(handle, x)
    }
  })
}

const updateHeader = ({ header, items }) => {
  setHtmlClass(
    header,
    'cranberry',
    items.find(item => !item.generalRule())
  )
}

// Recursively builds the HTML tree of rules and attaches them to root
// Returns a list of HTML nodes
//   - x can be either a rule of an item
const generateRules = (root, x) => {
  if (x instanceof Item) {
    const handle = document.createElement('li')
    handle.innerText = x.fullName
    root.appendChild(handle)
    return { handle, x }
  } else if (x instanceof Rule) {
    const handle = document.createElement(`span`)
    handle.innerText = x.text
    const ul = document.createElement('ul')
    const rules = sortRules(x).flatMap(y => generateRules(ul, y))
    root.appendChild(handle)
    root.appendChild(ul)
    return rules.concat({ handle, x })
  }
}

// Helper function for coloring the items with arbitrary rules
// Returns CSS color class name or `null` for no class
const getColor = item => {
  if (item instanceof Pop) {
    return {
      Botanic: 'rosebud',
      Lithoid: 'apricot',
      Mechanical: 'turquoise',
    }[item.id]
  } else if (item instanceof Trait) {
    if (traitsBotanic.includes(item)) return 'rosebud'
    else if (traitsLithoid.includes(item)) return 'apricot'
    else if (item.cost > 0) return 'turquoise'
    else if (item.cost < 0) return 'cranberry'
    return null
  } else if (item instanceof Origin) {
    return 'tacao'
  } else if (item instanceof Ethic) {
    if (item.id.startsWith('Fanatic')) return 'cranberry'
    else if (item.id.startsWith('Gestalt')) return 'tacao'
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
    else if (civicsHive.includes(item)) return 'lavender'
    else if (civicsMachine.includes(item)) return 'turquoise'
    return 'apricot'
  }

  return ''
}
