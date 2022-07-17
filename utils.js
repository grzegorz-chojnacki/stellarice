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

// Syntax sugar for creating rule objects
const every = (...items) => ({ type: 'every', items })
const some = (...items) => ({ type: 'some', items })
const none = (...items) => ({ type: 'none', items })
const one = (...items) => ({ type: 'one', items })

// Item decorator - names each item in a map, dependeing on the name of a prop
// to which that item was assigned
const nameItems = obj => {
  Object.keys(obj).forEach(prop => {
    obj[prop].id = prop
    obj[prop].name = prettify(prop)
  })
  return obj
}

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
      <div class="tooltip">${rulesToHtml(
        item,
        item.rules ? item.rules() : null
      )}</div>
    </div>`

// Search through object for an item
const nestedIn = (obj, item) => {
  if (!obj) return false
  if (obj === item) return true
  if (obj instanceof Array) {
    return obj.some(x => nestedIn(x, item))
  } else if (typeof obj === 'object') {
    return Object.values(obj).some(x => nestedIn(x, item))
  }
  return false
}

// Insert or remove item from list
const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
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
      return `<li ${checkItem(nestedIn(empire, x))}>
          ${x.constructor.name} ${x.name}
        </li>`
    } else {
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
    if (nestedIn(traitsBotanic, item)) return 'rosebud'
    else if (nestedIn(traitsLithoid, item)) return 'apricot'
    else if (item.value > 0) return 'turquoise'
    else if (item.value < 0) return 'cranberry'
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
    if (nestedIn(civicsCorporate, item)) return 'rosebud'
    else if (nestedIn(civicsHive, item)) return 'lavender'
    else if (nestedIn(civicsMachine, item)) return 'turquoise'
    return 'apricot'
  }

  return null
}
