// Generates HTML element from text
const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

// String helper functions
const capitalize = str => str[0].toUpperCase() + str.slice(1)
const decapitalize = str => str.replace(/\b(to|be|the|of)\b/gi, x => x.toLowerCase())
const spacify = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

// Convert PascalCase to normal wording, with specific capitalization rules
const prettify = str => decapitalize(capitalize(spacify(str)))

// Syntax sugar for creating rule objects
const every = (...items) => ({ type: 'every', items })
const some = (...items) => ({ type: 'some', items })
const none = (...items) => ({ type: 'none', items })
const one = (...items) => ({ type: 'one', items })

// Helper function for generating HTML flags (attributes without values)
const htmlFlag = (enabled, flag) => (enabled ? flag : '')
const disabled = item => htmlFlag(item.disabled(), 'disabled')
const invalid = item => htmlFlag(item.invalid(), 'invalid')
const checked = item => htmlFlag(item.checked(), 'checked')
const hidden = item => htmlFlag(item.hidden(), 'hidden')

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
    `
    <div ${hidden(item)}>
      <input
        type="${inputType}"
        id="${item.id}"
        name="${item.id}"
        ${attributes(item)}>
      <label for="${item.id}">${decorator(item)}${item.name}</label>
      <div class="tooltip">${rulesToHtml(item, item.rule)}</div>
    </div>`


// Helper function for getting item by id from all items
const getItem = id => {
  const item = all.find(item => item.id === id)
  if (!item) throw new Error(`Couldn't find '${id}'!`)
  return item
}

// Recursively inject items, essentialy replacing their id's to themselves
//   - When passed an item id, it will get the item nd return it
//   - When passed a rule object it will return it back with injected items
const injectItems = x => {
  if (!x) return x
  if (x instanceof Item) return x
  if (typeof x === 'string') return getItem(x)
  if (x.type) {
    x.items = x.items.map(injectItems);
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
    [[], []])


// Sort items depending on arbitrary rules
const sort = items => {
  // Place disabled as last
  items = [...partition(items, x => !x.disabled()).flatMap(x => x)]
  // Place checked & invalid as first
  items = [...partition(items, x => x.invalid() && x.checked()).flatMap(x => x)]
  return items
}

// Converts rule objects to HTML lists with coloring depending on pass/fail
const rulesToHtml = (() => {
  // Rules can fail/pass, items are just 'present' in the empire
  const checkRule = value => (value ? 'pass' : 'fail')
  const checkItem = value => (value ? 'present' : '')

  const ruleMap = {
    one: 'At most one of',
    some: 'At least one of',
    none: 'Cannot have',
    every: 'Must have',
  }

  return (item, x) => {
    if (x === null) return 'No special rules'
    else if (x instanceof Item) {
      return `<li ${checkItem(x.checked())}>
          ${x.constructor.name} ${x.name}
        </li>`
    } else if (x.type) {
      const checkResult = checkRule(item.test(x))
      return `
        <li ${checkResult}>
          <strong>${ruleMap[x.type]}:</strong>
        </li>
        <ul ${checkResult}>
          ${x.items.map(y => rulesToHtml(item, y)).join('')}
        </ul>`
    }
  }
})()

// Helper function for coloring the items with arbitrary rules
// Returns CSS color class name or `null` for no class
const getColor = item => {
  if (item instanceof Pop) {
    return {
      Biological: 'tacao',
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
