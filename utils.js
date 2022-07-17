const deepCopy = o => JSON.parse(JSON.stringify(o))

const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

const capitalize   = str => str[0].toUpperCase() + str.slice(1)
const decapitalize = str => str.replace(/\<(be|the|of)\>/ig, x => x.toLowerCase())
const spacify      = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

const nameItems = obj => {
  Object.keys(obj).forEach(prop => {
    obj[prop].name = decapitalize(capitalize(spacify(prop)))
  })
  return obj
}

const htmlFlag = (enabled, flag) => enabled ? flag : ''
const disabled = item => htmlFlag(!item.valid(), 'disabled')
const invalid  = item => htmlFlag(item.invalid(), 'invalid')
const checked  = item => htmlFlag(item.checked(), 'checked')
const hidden   = item => htmlFlag(item.hidden(), 'hidden')
const isOrigin = trait => htmlFlag(trait.origin(), 'origin')

const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

const nestedIncludes = (obj, item) => {
  for (const prop in obj) {
    if (obj[prop] instanceof Array && obj[prop].includes(item)) {
      return true
    }
  }
  return false
}

const testRule = x => (typeof(x) === 'boolean') ? x : nestedIncludes(empire, x)
const every    = (...items) => items.every(testRule)
const some     = (...items) => items.some(testRule)
const none     = (...items) => !some(...items)
