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

// List of various HTML elements which will need to be updated
const elements = { inputs: [], headers: [], tooltipCallbacks: [] }

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

// Main handler for updateing HTML elements after a user action
const updateElements = () => {
  elements.headers.forEach(({ header, items }) => {
    header.classList.remove('cranberry')
    if (items.find(item => !item.generalRule())) {
      header.classList.add('cranberry')
    }
  })

  elements.tooltipCallbacks.forEach(fn => fn())

  elements.inputs.forEach(({ input, item }) => {
    input.checked = item.checked()
    setHtmlFlag(input, 'disabled', item.disabled())
    setHtmlFlag(input, 'invalid', item.invalid())
    renderSummary()
  })
}

// Input/label onclick handler
const onClickAction = (item, name) => () => {
  toggleIncluded(empire[name], item)
  updateElements()
}

// Render the empire summary
const renderSummary = () => {
  summary.innerHTML = '<h2>Empire summary</h2>'
  const table = htmlToElement('<table></table>')

  Object.entries(empire).forEach(([name, items]) => {
    const row = htmlToElement('<tr></tr>')
    row.appendChild(htmlToElement(`<th>${capitalize(name)}:</th>`))

    const entries = htmlToElement('<td></td>')
    if (items.length === 0) {
      entries.classList.add('comment')
      entries.innerText = name === 'pop' ? 'Biological' : 'Empty'
    } else {
      items.forEach(item => {
        const entry = htmlToElement(entryTemplate(item))
        const label = entry.getElementsByTagName('label')[0]

        label.onclick = onClickAction(item, name)
        label.classList.add(getColor(item))

        entries.appendChild(entry)
      })
    }

    table.appendChild(row).appendChild(entries)
  })

  summary.appendChild(table)
}

// Render the items
const renderItems = () => {
  options.innerHTML = ''
  sections.forEach(({ name, details, template, items }) => {
    const section = htmlToElement('<section></section>')
    const header = htmlToElement(`<h2>${capitalize(name)}</h2>`)
    elements.headers.push({ header, items })

    section.appendChild(header)

    if (details) section.appendChild(htmlToElement(details()))

    const inputList = htmlToElement('<div class="input-list"></div>')

    // Go through all items related to this section
    sortItems(items).forEach(item => {
      const element = htmlToElement(template(item))
      const input = element.getElementsByTagName('input')[0]
      const tooltip = element.getElementsByClassName('tooltip')[0]

      elements.inputs.push({ input, item })
      elements.tooltipCallbacks.push(...generateRules(tooltip, item, item.rule))

      input.onclick = onClickAction(item, name)
      element.classList.add(getColor(item))

      inputList.appendChild(element)
    })

    options.appendChild(section).appendChild(inputList)
  })
}

// Initialize the view
renderSummary()
renderItems()
updateElements()
