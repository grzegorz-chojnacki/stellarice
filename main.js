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
  const main = document.getElementsByTagName('main')[0]

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
      summary: () => `
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
      summary: () => `<p>Available slots: ${2 - empire.civics.length}</p>`,
    },
  ]

  return () => {
    main.innerHTML = ''
    // Build each section, where:
    //   name     - both the section name and related item map (from `all` items)
    //   summary  - a special section for traits
    //   tamplate - HTML tamplate dependent on a given item
    sections.forEach(({ name, summary, template, items }) => {
      const section = htmlToElement('<section></section>')
      section.appendChild(htmlToElement(`<h2>${capitalize(name)}</h2>`))

      if (summary) section.appendChild(htmlToElement(summary()))

      // Go through all items related to this section
      sort(items).forEach(item => {
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

      main.appendChild(section)
    })
  }
})()

// Initialize view
render()
