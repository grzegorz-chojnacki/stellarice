const deepCopy = o => JSON.parse(JSON.stringify(o))

const template = {
  ethics: [],
  traits: [],
  civics: [],
  authority: [],
  origin: [],
  pop: []
}

const empire = deepCopy(template)


// Ethics
const ethicsValueSum = () => empire.ethics.reduce((acc, { value }) => acc + value, 0)

const ethicChecked = ethic => empire.ethics.includes(ethic)
const ethicValidator = ethic => {
  if (ethicChecked(ethic)) return true
  return (empire.ethics.length < 2) && (ethicsValueSum() + ethic.value <= 3)
}


const all = {
  ethics: [
    { name: 'Fanatic Militarist',    value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Fanatic Pacifist',      value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Fanatic Xenophobe',     value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Fanatic Xenophile',     value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Fanatic Authoritarian', value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Fanatic Egalitarian',   value: 2, checked: ethicChecked, valid: ethicValidator },
    { name: 'Militarist',            value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Pacifist',              value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Xenophobe',             value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Xenophile',             value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Authoritarian',         value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Egalitarian',           value: 1, checked: ethicChecked, valid: ethicValidator },
    { name: 'Gestalt',               value: 3, checked: ethicChecked, valid: ethicValidator },
  ],
  traits: [],
  civics: [],
  authority: [],
  origin: [],
  pop: [],
}

// Rendering
const htmlToElement = html => {
  const template = document.createElement('template')
  template.innerHTML = `<div>${html.trim()}</div>`
  return template.content.firstChild
}

const disabled = item => !(item.valid(item)) ? 'disabled' : ''
const checked = item => (item.checked(item)) ? 'checked' : ''
const toggleIncluded = (list, item) => {
  console.log(list, item)
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

const sections = [
  {
    name: 'ethics',
    section: document.getElementById('ethics'),
    template: item => `
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
  {
    name: 'traits',
    section: document.getElementById('traits'),
    template: item => `
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
  {
    name: 'civics',
    section: document.getElementById('civics'),
    template: item => `
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
  {
    name: 'authority',
    section: document.getElementById('authority'),
    template: item => `
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
  {
    name: 'origin',
    section: document.getElementById('origin'),
    template: item => `
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
  {
    name: 'pop',
    section: document.getElementById('pop'),
    template: item => `
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>`
  },
]

const render = () => {
  sections.forEach(({ name, section, template }) => {
    section.innerHTML = ''
    all[name].forEach(item => {
      const element = htmlToElement(template(item))
      const input = element.getElementsByTagName('input')[0]
      input.onclick = () => { toggleIncluded(empire[name], item); render() }
      section.appendChild(element)
    })
  })
}

render()
