const deepCopy = o => JSON.parse(JSON.stringify(o))

const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

const capitalize = str => str[0].toUpperCase() + str.slice(1)

const disabled = item => !item.valid() ? 'disabled' : ''
const invalid  = item => item.invalid() ? 'invalid' : ''
const checked  = item => item.checked() ? 'checked' : ''

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

const and      = fn => xs => xs.every(fn)
const or       = fn => xs => xs.some(fn)
const id       = x => x
const inEmpire = x => nestedIncludes(empire, x)

const applyOperation = (xs, operation) =>
  (xs.every(x => typeof(x) === 'boolean'))
    ? operation(id)(xs)
    : operation(inEmpire)(xs)

const every = (...items) => applyOperation(items, and)
const some  = (...items) => applyOperation(items, or)
const none = (...items) => !some(...items)
