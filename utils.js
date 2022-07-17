const deepCopy = o => JSON.parse(JSON.stringify(o))

const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

const capitalize   = str => str[0].toUpperCase() + str.slice(1)
const decapitalize = str => str.replace(/\b(to|be|the|of)\b/ig, x => x.toLowerCase())
const spacify      = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()
const prettify     = str => decapitalize(capitalize(spacify(str)))

const nameItems = obj => {
  Object.keys(obj).forEach(prop => {
    obj[prop].id = prop
    obj[prop].name = prettify(prop)
  })
  return obj
}

const htmlFlag = (enabled, flag) => enabled ? flag : ''
const disabled = item => htmlFlag(!item.valid(), 'disabled')
const invalid  = item => htmlFlag(item.invalid(), 'invalid')
const checked  = item => htmlFlag(item.checked(), 'checked')
const hidden   = item => htmlFlag(item.hidden(), 'hidden')
const isOrigin = trait => htmlFlag(trait.origin(), 'origin')

const itemAttrributes = item => `
  ${checked(item)}
  ${invalid(item)}
  ${disabled(item)}`

const traitAttrributes = trait => `
  ${isOrigin(trait)}
  ${checked(trait)}
  ${invalid(trait)}
  ${disabled(trait)}`

const sectionTemplate = (inputType, attributes) => item => `
  <div ${hidden(item)}>
    <input
      type="${inputType}"
      id="${item.id}"
      name="${item.id}"
      ${attributes(item)}>
    <label for="${item.id}">${item.name}</label>
    <div class="tooltip">${rulesToHtml(getRules(item))}</div>
  </div>`

const nestedIn = (obj, item) => {
  if (!obj) return false
  if (obj === item) return true
  if (obj instanceof Array)
    return obj.some(x => nestedIn(x, item))
  if (typeof(obj) === 'object')
      return Object.values(obj).some(x => nestedIn(x, item))
  return false
}

const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

const testRule = x => {
  if (x === undefined) throw new Error('Undefined value in rule, check typos')
  return (typeof(x) === 'boolean') ? x : nestedIn(empire, x)
}

const every = (...items) => items.every(testRule)
const some  = (...items) => items.some(testRule)
const none  = (...items) => !some(...items)

const getRules = item => (!item.rules)
  ? null
  : JSON.parse(item.rules.toString()
    .replace(/\(\) => /g, '')                // Drop arrow function
    .replace(/[\n ]/g, '')                   // Drop whitespace
    .replace(/\b([a-z]+)\(/g,                // Select rules starts and replace
      (_, x) => `{ type: ${x}, content: [`)  // them with JSON structure starts
    .replace(/\)/g, ']}')                    // Replace ends of rules with JSON
    .replace(/,]/g, ']')                     // Drop trailing commas
    .replace(/[.a-zA-Z]+/g, x => `"${x}"`))  // Surround words with quotes

const ruleMap = {
  some: 'Some of',
  none: 'Cannot have',
  every: 'Must have',
}

const rulesToHtml = x => (x === null)
  ? 'No special rules'
  : (typeof(x) === 'string')
    ? `<li>${prettify(x).replace('.', '')}</li>`
    : `${ruleMap[x.type]}:
      <ul>
        ${x.content.map(y => rulesToHtml(y)).join('')}
      </ul>`
