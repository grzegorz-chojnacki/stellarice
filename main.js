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

// Section templates
//   name      - the name displayed at the top of the section
//   items     - items associated with this section
//   template  - HTML tamplate dependent on a given item
//   refernces - Data and HTML node references used for updating the view
//   details   - additional details about this section
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

const updateView = () => {
  sections.references.forEach(({ summary, header, details, inputs }) => {
    updateSummary(sortSummary(summary))
    updateHeader(header)

    details.handle.innerHTML = details.refresh()

    sortInputs(inputs).forEach(({ handle }) => {
      const container = handle.parentNode
      container.parentNode.appendChild(container)
    })

    inputs.forEach(updateInput)
  })
}

const renderView = () => {
  const summary = document.getElementById('summary')
  const options = document.getElementById('options')

  summary.appendChild(document.createElement('h2')).append('Empire summary')
  const table = summary.appendChild(document.createElement('table'))

  sections.references = sections.map(
    ({ name, items, template, details = () => '' }) => {
      const row = table.insertRow()
      row.appendChild(document.createElement('th')).append(capitalize(name))

      const section = options.appendChild(document.createElement('section'))
      const header = section.appendChild(document.createElement('h2'))
      header.innerHTML = capitalize(name)

      const handle = section.appendChild(document.createElement('div'))
      const inputList = section.appendChild(document.createElement('div'))
      inputList.classList.add('input-list')

      const inputs = items.map(item => {
        const element = inputList.appendChild(htmlToElement(template(item)))
        const handle = element.getElementsByTagName('input')[0]
        const tooltip = element.getElementsByClassName('tooltip')[0]

        element.classList.add(getColor(item))

        const rules = generateRules(tooltip, item.rule)

        handle.onclick = () => {
          toggleIncluded(empire[name], item)
          updateView()
        }

        return { item, handle, rules }
      })

      return {
        summary: { handle: row.insertCell(), items: empire[name], name },
        header: { handle: header, items },
        details: { handle, refresh: details },
        inputs,
      }
    }
  )
}

// Initialize the view
renderView()
updateView()
