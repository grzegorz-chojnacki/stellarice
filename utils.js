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

const nestedIncludes = (obj, item) => {
  for (const prop in obj) {
    if (obj[prop] instanceof Array && obj[prop].includes(item)) {
      return true
    }
  }
  return false
}