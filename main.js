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

// Render whole page, rerender on any input onclick event
const render = (() => {
  const summary = document.getElementById('summary')
  const options = document.getElementById('options')

  // Section templates
  const sections = [
    {
      name: 'pop',
      items: pop,
      template: sectionTemplate('radio', itemAttrributes),
    },
    {
      name: 'traits',
      items: traits,
      details: () => `
        <p>
          Available traits: ${5 - empire.traits.length}<br>
          Available points: ${empire.traits.reduce(Trait.costSum, 2)}
        </p>`,
      template: sectionTemplate(
        'checkbox',
        traitAttrributes,
        item => `[${item.cost.toString().padStart(2)}] `
      ),
    },
    {
      name: 'origin',
      items: origin,
      template: sectionTemplate('radio', itemAttrributes),
    },
    {
      name: 'ethics',
      items: ethics,
      template: sectionTemplate('checkbox', itemAttrributes),
    },
    {
      name: 'authority',
      items: authority,
      template: sectionTemplate('radio', itemAttrributes),
    },
    {
      name: 'civics',
      items: civics,
      template: sectionTemplate('checkbox', itemAttrributes),
      details: () => `<p>Available civics: ${2 - empire.civics.length}</p>`,
    },
  ]

  return () => {
    // Summary with chosen options
    summary.innerHTML = `<h2>Empire</h2>`

    Object.entries(empire).forEach(([name, items]) => {
      const entries = htmlToElement(`<div>${capitalize(name)}:</div>`)

      if (items.length === 0) {
        const placeholder = htmlToElement('<span class="comment"></span>')
        placeholder.innerText = (name === 'pop') ? 'Biological' : 'Empty'
        entries.appendChild(placeholder)
      } else {
        items.forEach(item => {
          const entry = htmlToElement(entryTemplate(item))
          const label = entry.getElementsByTagName('label')[0]

          label.onclick = () => {
            toggleIncluded(empire[name], item)
            render()
          }

          const color = getColor(item)
          if (color) label.classList.add(color)

          entries.appendChild(entry)
        })
      }

      summary.appendChild(entries)
    })

    // Options for configuring the empire
    options.innerHTML = ''
    // Build each section, where:
    //   name     - both the section name and related item map (from `all` items)
    //   details  - additional details about this section
    //   template - HTML tamplate dependent on a given item
    //   items    - items associated with this section
    sections.forEach(({ name, details, template, items }) => {
      const section = htmlToElement('<section></section>')
      const header = htmlToElement(`<h2>${capitalize(name)}</h2>`)

      if (items.find(item => !item.generalRule())) {
        header.classList.add('cranberry')
      }

      section.appendChild(header)

      if (details) section.appendChild(htmlToElement(details()))

      // Go through all items related to this section
      sortItems(items).forEach(item => {
        const element = htmlToElement(template(item))
        const input = element.getElementsByTagName('input')[0]

        input.onclick = () => {
          toggleIncluded(empire[name], item)
          render()
        }

        const color = getColor(item)
        if (color) element.classList.add(color)

        section.appendChild(element)
      })

      options.appendChild(section)
    })
  }
})()

// Initialize view
render()
