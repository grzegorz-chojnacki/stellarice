const deepCopy = o => JSON.parse(JSON.stringify(o))

const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

const capitalize   = str => str[0].toUpperCase() + str.slice(1)
const decapitalize = str => str.replace(/\b(to|be|the|of)\b/ig, x => x.toLowerCase())
const spacify      = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

const nameItems = obj => {
  Object.keys(obj).forEach(prop => {
    obj[prop].id = prop
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

const getRules = item => {
  if (item.rules) {
    return item.rules.toString()
      .replace(/\(\) => /g, '')
      .replace(/every/g, 'must have')
      .replace(/some/g, 'some of')
      .replace(/none/g, 'cannot have')
      .replace(/\(/g, ': ')
      .replace(/[,\)]/g, '')
  }
  return ''
}
