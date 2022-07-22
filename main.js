const all = [...pop, ...traits, ...origin, ...ethics, ...authority, ...civics]
all.forEach(item => injectItems(item.rule))

const empire = {
  pop: [],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}

const summary = document.getElementById('summary')
const options = document.getElementById('options')

// List of various callback functions that refresh the DOM after state change
const updatable = { headers: [], inputs: [], details: [] }

// Section templates
//   name     - the name displayed at the top of the section
//   items    - items associated with this section
//   details  - additional details about this section
//   template - HTML tamplate dependent on a given item
const sections = [
  {
    name: 'pop',
    items: pop,
    template: sectionTemplate('radio'),
  },
  {
    name: 'traits',
    items: traits,
    details: () => `
      <p class="details">
        Available traits: ${5 - empire.traits.length}<br>
        Available points: ${empire.traits.reduce(Trait.costSum, 2)}
      </p>`,
    template: sectionTemplate('checkbox'),
  },
  {
    name: 'origin',
    items: origin,
    template: sectionTemplate('radio'),
  },
  {
    name: 'ethics',
    items: ethics,
    template: sectionTemplate('checkbox'),
  },
  {
    name: 'authority',
    items: authority,
    template: sectionTemplate('radio'),
  },
  {
    name: 'civics',
    items: civics,
    template: sectionTemplate('checkbox'),
    details: () =>
      `<p class="details">Available civics: ${2 - empire.civics.length}</p>`,
  },
]

const updateView = () => {
  renderSummary()
  updatable.details.forEach(updateDetails)
  updatable.headers.forEach(updateHeader)
  updatable.inputs.forEach(updateInput)
}

// Render the empire summary
const renderSummary = () => {
  summary.innerHTML = '<h2>Empire summary</h2>'
  const table = summary.appendChild(document.createElement('table'))

  Object.entries(empire).forEach(([name, items]) => {
    const row = table.insertRow()
    row.appendChild(document.createElement('th')).innerText = capitalize(name)

    const entries = row.insertCell()

    if (items.length === 0) {
      entries.classList.add('comment')
      entries.innerText = name === 'pop' ? 'Biological' : 'Empty'
    } else {
      items.forEach(item =>
        entries
          .appendChild(htmlToElement(entryTemplate(item)))
          .getElementsByTagName('label')[0]
          .classList.add(getColor(item))
      )
    }
  })
}

// Render the items
const renderItems = () => {
  options.innerHTML = ''
  sections.forEach(({ name, details, template, items }) => {
    const section = options.appendChild(document.createElement('section'))
    const header = section.appendChild(document.createElement('h2'))
    header.innerHTML = capitalize(name)
    updatable.headers.push({ header, items })

    if (details) {
      const handle = section.appendChild(document.createElement('div'))
      updatable.details.push({ handle, fn: details })
    }

    const inputList = section.appendChild(document.createElement('div'))
    inputList.classList.add('input-list')

    // Go through all items related to this section
    sortItems(items).forEach(item => {
      const element = inputList.appendChild(htmlToElement(template(item)))
      const input = element.getElementsByTagName('input')[0]
      const tooltip = element.getElementsByClassName('tooltip')[0]

      element.classList.add(getColor(item))

      const rules = generateRules(tooltip, item.rule)
      updatable.inputs.push({ item, input, rules })

      input.onclick = () => {
        toggleIncluded(empire[name], item)
        updateView()
      }
    })
  })
}

// Initialize the view
renderItems()
updateView()
