// List of all items
const all = [...pop, ...traits, ...origin, ...ethics, ...authority, ...civics]

// Take the simple item rule structure based on item ids and recursively
// inject real items into their place
all.forEach(item => injectItems(item.rule))

// The empire structure, used for keeping the state of which item is checked
const empire = {
  pop: [],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}

// Section templates
//   name       - the name displayed at the top of the section
//   items      - items associated with this section
//   template   - HTML tamplate dependent on a given item
//   references - Data and HTML node references used for updating sections
//   details    - additional details about this section
const sections = [
  {
    name: 'pop',
    items: pop,
    template: sectionTemplate('radio'),
    references: {},
  },
  {
    name: 'traits',
    items: traits,
    references: {},
    details: () => `
      Available traits:
        <span class="trait-point">${5 - empire.traits.length}</span><br>
      Available points:
        <span class="trait-point">
          ${empire.traits.reduce(Trait.costSum, 2)}
        </span>`,
    template: sectionTemplate('checkbox'),
  },
  {
    name: 'origin',
    items: origin,
    template: sectionTemplate('radio'),
    references: {},
  },
  {
    name: 'ethics',
    items: ethics,
    template: sectionTemplate('checkbox'),
    references: {},
  },
  {
    name: 'authority',
    items: authority,
    template: sectionTemplate('radio'),
    references: {},
  },
  {
    name: 'civics',
    items: civics,
    template: sectionTemplate('checkbox'),
    references: {},
    details: () => `Available civics: ${2 - empire.civics.length}`,
  },
]

// Update routine, triggered after each input click event
const updateView = () => {
  sections.forEach(section => {
    const { summary, header, details, inputs } = section.references
    sortSummary(summary)
    updateSummary(summary)

    updateHeader(header)

    details.handle.innerHTML = details.refresh()

    sortInputs(inputs)
    inputs.map(updateInput)
  })
}

// Create an input and its label for a given item, return references
const renderInputs = (empireList, inputList, inputTemplate) => item => {
  const element = inputList.appendChild(htmlToElement(inputTemplate(item)))
  const handle = element.getElementsByTagName('input')[0]
  const tooltip = element.getElementsByClassName('tooltip')[0]

  element.classList.add(getColor(item))

  handle.onclick = () => {
    toggleIncluded(empireList, item)
    updateView()
  }

  return { item, handle, rules: generateRules(tooltip, item.rule) }
}

// Create a section, return its references
const renderSection = (options, table) => section => {
  const { name, items, template, details = () => '' } = section

  const row = table.insertRow()
  row.appendChild(document.createElement('th')).append(capitalize(name))
  const root = options.appendChild(document.createElement('section'))
  const header = root.appendChild(document.createElement('h2'))
  header.innerHTML = capitalize(name)

  const handle = root.appendChild(document.createElement('div'))
  const inputList = root.appendChild(document.createElement('div'))
  inputList.classList.add('input-list')

  const inputs = items.map(renderInputs(empire[name], inputList, template))

  section.references = {
    summary: { handle: row.insertCell(), items: empire[name], name },
    header: { handle: header, items },
    details: { handle, refresh: details },
    inputs,
  }
}

// Create empire summary and all sections
const renderView = () => {
  const summary = document.getElementById('summary')
  const options = document.getElementById('options')

  summary.appendChild(document.createElement('h2')).append('Empire summary')
  const table = summary.appendChild(document.createElement('table'))

  sections.forEach(renderSection(options, table))
}

// Initialize the view
renderView()
updateView()
