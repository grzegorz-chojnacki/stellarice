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

// Helper function for generating HTML flags (attributes without values)
const htmlFlag = (enabled, flag) => (enabled ? flag : '')
const disabled = item => htmlFlag(item.disabled(), 'disabled')
const invalid = item => htmlFlag(item.invalid(), 'invalid')
const checked = item => htmlFlag(item.checked(), 'checked')

// Helper functions for sectionTemplate
const itemAttrributes = item => `
  ${checked(item)}
  ${invalid(item)}
  ${disabled(item)}`

const traitAttrributes = trait => `
  ${checked(trait)}
  ${invalid(trait)}
  ${disabled(trait)}`

// Abstract section template builder:
//   inputType  - checkbox, radio
//   attributes - helper function for generating a group of HTML attrubutes
//   decorator  - generates markup which wich will be prepended to the item name
const sectionTemplate =
  (inputType, attributes, decorator = () => '') =>
  item =>
    `<div>
      <input
        type="${inputType}"
        id="${item.id}"
        name="${item.id}"
        ${attributes(item)}>
      <label for="${item.id}">${decorator(item)}${item.name}</label>
      <div class="tooltip">${rulesToHtml(item, item.rule)}</div>
    </div>`

// Entry template:
const entryTemplate = item => `
  <span>
    <label for="${item.id}">${item.name}</label>,
    <div class="tooltip">${rulesToHtml(item, item.rule)}</div>
  </span>`

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

// Converts rules to HTML lists with coloring depending on pass/fail
const rulesToHtml = (() => {
  return (item, x) => {
    if (x instanceof Item) {
      return `<li ${x.checked() ? 'present' : ''}>${x.fullName}</li>`
    } else if (x instanceof Rule) {
      return `
        <span ${item.rule.test() ? 'pass' : 'fail'}>${x.text}</span>
        <ul>
          ${sortRules(x)
            .map(y => rulesToHtml(item, y))
            .join('')}
        </ul>`
    }
  }
})()

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

  return null
}
