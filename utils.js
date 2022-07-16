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

// Takes a set of objects that have circular dependencies with each other.
// Each object has a list of props that at the beginning are functions, which
// should return the final value for their prop.
// We are going through the set as long as there are exceptions with resolving
// the dependencies
let counter = 0
const bruteForceDependencies = root => {
  let encounteredException = false
  for (const object of Object.values(root)) {
    for (const prop of Object.keys(object)) {
      // try {
        if (typeof(object[prop]) === 'function') {
          object[prop] = object[prop]()
        }
      // } catch (e) {
        // console.log(e)
        // if (counter++ > 100) { return }
        // encounteredException = true
      // }
    }
  }

  if (encounteredException) bruteForceDependencies(root)
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
