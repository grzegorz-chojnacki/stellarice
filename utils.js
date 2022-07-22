// Helper partition function
const partition = (arr, fn) =>
  arr.reduce(
    ([a, b], x) => (fn(x) ? [a.concat(x), b] : [a, b.concat(x)]),
    [[], []]
  )

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
    <input type="${inputType}" id="${item.id}">
    <label for="${item.id}">${item.label}</label>
    <div class="tooltip"></div>
  </div>`

const updateDetails = ({ handle, fn }) => (handle.innerHTML = fn())

const updateRuleItem = (node, item) =>
  setHtmlFlag(node, 'present', item.checked())
const updateRule = (node, item) => setHtmlFlag(node, 'pass', item.rule.test())

const updateInput = ({ handle, item, rules }) => {
  handle.checked = item.checked()
  setHtmlFlag(handle, 'disabled', item.disabled())
  setHtmlFlag(handle, 'invalid', item.invalid())

  rules.forEach(({ handle, x }) => {
    if (x instanceof Rule) {
      updateRule(handle, item)
    } else if (x instanceof Item) {
      updateRuleItem(handle, x)
    }
  })
}

const updateHeader = ({ handle, items }) => {
  setHtmlClass(
    handle,
    'cranberry',
    items.find(item => !item.generalRule())
  )
}

const updateSummary = ({ handle, name, items }) => {
  if (items.length === 0) {
    const text = name === 'pop' ? 'Biological' : 'Empty'
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

const sortSummary = rows => {
  rows.forEach(row => {
    const byGetOrder = (a, b) => (getOrder(a) > getOrder(b) ? -1 : 1)

    row.items.sort((a, b) => a.id.localeCompare(b.id))
    row.items.sort((a, b) => b.cost - a.cost)
    row.items.sort(byGetOrder)
  })

  return rows
}

const sortInputs = inputs => {
  const disabledLast = ({ item }) => !item.disabled()
  const invalidFirst = ({ item }) => item.invalid() && item.checked()
  const byGetOrder = (a, b) => (getOrder(a.item) > getOrder(b.item) ? -1 : 1)

  inputs.sort((a, b) => a.item.id.localeCompare(b.item.id))

  if (inputs[0].item instanceof Trait) {
    inputs.sort((a, b) => b.item.cost - a.item.cost)
  }

  inputs.sort(byGetOrder)
  inputs = partition(inputs, disabledLast).flatMap(x => x)
  inputs = partition(inputs, invalidFirst).flatMap(x => x)

  return inputs
}

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

// Recursively builds the HTML tree of rules and attaches them to root
// Returns a list of HTML nodes
//   - x can be either a rule of an item
const generateRules = (root, x) => {
  if (x instanceof Item) {
    const handle = root.appendChild(document.createElement('li'))
    handle.classList.add('rule-item')
    handle.innerText = x.fullName
    return { handle, x }
  } else if (x instanceof Rule) {
    const handle = root.appendChild(document.createElement('span'))
    handle.classList.add('rule')
    handle.innerText = x.text
    const ul = root.appendChild(document.createElement('ul'))
    const rules = sortRules(x).flatMap(y => generateRules(ul, y))
    return rules.concat({ handle, x })
  }
}

// Helper function for coloring the items with arbitrary rules
// Returns CSS color class name or `null` for no class
const getColor = item => {
  switch (true) {
    case item instanceof Pop:
      return {
        Botanic: 'rosebud',
        Lithoid: 'apricot',
        Mechanical: 'turquoise',
      }[item.id]
    case item instanceof Trait:
      if (traitsBotanic.includes(item)) return 'rosebud'
      if (traitsLithoid.includes(item)) return 'apricot'
      if (item.cost > 0) return 'turquoise'
      if (item.cost < 0) return 'cranberry'
      return null
    case item instanceof Origin:
      return 'tacao'
    case item instanceof Ethic:
      if (item.id.startsWith('Fanatic')) return 'cranberry'
      if (item.id.startsWith('Gestalt')) return 'tacao'
      return 'apricot'
    case item instanceof Authority:
      return {
        Imperial: 'cranberry',
        Dictatorial: 'apricot',
        Oligarchic: 'rosebud',
        Democratic: 'tacao',
        Corporate: 'tacao',
        HiveMind: 'lavender',
        MachineIntelligence: 'turquoise',
      }[item.id]
    case item instanceof Civic:
      if (civicsCorporate.includes(item)) return 'rosebud'
      if (civicsHive.includes(item)) return 'lavender'
      if (civicsMachine.includes(item)) return 'turquoise'
      return 'apricot'
  }
}
