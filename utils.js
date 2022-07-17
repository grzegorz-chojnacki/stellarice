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
const disabled = item => htmlFlag(item.disabled(), 'disabled')
const invalid  = item => htmlFlag(item.invalid(), 'invalid')
const checked  = item => htmlFlag(item.checked(), 'checked')
const hidden   = item => htmlFlag(item.hidden(), 'hidden')

// Rules can fail/pass, items can only be present in the empire
// Controls tooltip coloring
const checkRule = value => value ? 'pass' : 'fail'
const checkItem = value => value ? 'present' : ''

const itemAttrributes = item => `
  ${checked(item)}
  ${invalid(item)}
  ${disabled(item)}`

  const traitAttrributes = trait => `
  ${checked(trait)}
  ${invalid(trait)}
  ${disabled(trait)}`

const sectionTemplate = (inputType, attributes, decorator = () => '') => item => `
  <div ${hidden(item)}>
    <input
      type="${inputType}"
      id="${item.id}"
      name="${item.id}"
      ${attributes(item)}>
    <label for="${item.id}">${decorator(item)}${item.name}</label>
    <div class="tooltip">${rulesToHtml(item, item.rules ? item.rules() : null)}</div>
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

const rulesToHtml = (item, x) => {
  if (x === null) return 'No special rules'
  else if (x instanceof Item) {
    return `<li ${checkItem(nestedIn(empire, x))}>${x.constructor.name} ${x.name}</li>`
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
