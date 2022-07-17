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
    <div class="tooltip">${rulesToHtml(item.rules ? item.rules() : null)}</div>
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

const every = (...items) => ({ type: 'every', items })
const some  = (...items) => ({ type: 'some',  items })
const none  = (...items) => ({ type: 'none',  items })
const one   = (...items) => ({ type: 'one',   items })

const ruleMap = {
  one:   'One of',
  some:  'Some of',
  none:  'Cannot have',
  every: 'Must have',
}

const rulesToHtml = x => {
  if (x === null) return 'No special rules'
  else if (x instanceof Item) {
    return `<li>${x.constructor.name} ${x.name}</li>`
  } else {
    return `${ruleMap[x.type]}:
      <ul>
        ${x.items.map(y => rulesToHtml(y)).join('')}
      </ul>`
  }
}
