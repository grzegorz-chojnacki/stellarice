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

// List of various callback functions that refresh the DOM after state change
const updatable = { summary: [], sections: {} }

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
        Available traits: ${5 - empire.traits.length}<br>
        Available points: ${empire.traits.reduce(Trait.costSum, 2)}`,
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
    details: () => `Available civics: ${2 - empire.civics.length}`,
  },
]

const updateView = () => {
  sortSummary(updatable.summary).forEach(updateSummary)

  Object.values(updatable.sections).forEach(section => {
    updateHeader(section.header)

    section.details.handle.innerHTML = section.details.fn()

    sortInputs(section.inputs).forEach(({ handle }) => {
      const container = handle.parentNode
      container.parentNode.appendChild(container)
    })

    section.inputs.forEach(updateInput)
  })
}

const renderView = () => {
  const summary = document.getElementById('summary')
  const options = document.getElementById('options')

  summary.appendChild(document.createElement('h2')).append('Empire summary')
  const table = summary.appendChild(document.createElement('table'))

  sections.forEach(({ name, items, template, details = () => '' }) => {
    const row = table.insertRow()
    row.appendChild(document.createElement('th')).append(capitalize(name))
    updatable.summary.push({
      handle: row.insertCell(),
      items: empire[name],
      name,
    })

    const section = options.appendChild(document.createElement('section'))
    const header = section.appendChild(document.createElement('h2'))
    header.innerHTML = capitalize(name)

    const handle = section.appendChild(document.createElement('div'))
    const inputList = section.appendChild(document.createElement('div'))
    inputList.classList.add('input-list')

    updatable.sections[name] = {
      header: { handle: header, items },
      details: { handle, fn: details },
      inputs: [],
      items,
    }

    // Go through all items related to this section
    items.forEach(item => {
      const element = inputList.appendChild(htmlToElement(template(item)))
      const handle = element.getElementsByTagName('input')[0]
      const tooltip = element.getElementsByClassName('tooltip')[0]

      element.classList.add(getColor(item))

      const rules = generateRules(tooltip, item.rule)
      updatable.sections[name].inputs.push({ item, handle, rules })

      handle.onclick = () => {
        toggleIncluded(empire[name], item)
        updateView()
      }
    })
  })
}

// Initialize the view
renderView()
updateView()
