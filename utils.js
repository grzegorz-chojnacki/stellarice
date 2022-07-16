const deepCopy = o => JSON.parse(JSON.stringify(o))

const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

const capitalize = str => str[0].toUpperCase() + str.slice(1)

const disabled = item => item.valid() ? '' : 'disabled'
const checked = item => item.checked() ? 'checked' : ''

const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

Object.prototype.has = function (something) {
  for (const prop in this) {
    if (this[prop] === something) return true
    if (typeof(this[prop]) === 'object' && this[prop].has(something)) {
      return true
    }
  }
  return false
}

const nestedIncludes = (obj, item) => {
  for (const prop in obj) {
    if (obj[prop] instanceof Array && obj[prop].includes(item)) {
      return true
    }
  }
  return false
}