const all = { pop, traits, origin, ethics, authority, civics }

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
      template: sectionTemplate('radio', itemAttrributes),
    },
    {
      name: 'traits',
      summary: () => `
        <p>
          Available traits: ${5 - empire.traits.length}<br>
          Available points: ${empire.traits.reduce(Trait.costSum, 2)}
        </p>`,
      template: sectionTemplate(
        'checkbox',
        traitAttrributes,
        item => `[<span class="trait-point">${item.value}</span>] `
      ),
    },
    {
      name: 'origin',
      template: sectionTemplate('checkbox', itemAttrributes),
    },
    {
      name: 'ethics',
      template: sectionTemplate('checkbox', itemAttrributes),
    },
    {
      name: 'authority',
      template: sectionTemplate('radio', itemAttrributes),
    },
    {
      name: 'civics',
      template: sectionTemplate('checkbox', itemAttrributes),
    },
  ]

  return () => {
    main.innerHTML = ''
    // Build each section, where:
    //   name     - both the section name and related item map (from `all` items)
    //   summary  - a special section for traits
    //   tamplate - HTML tamplate dependent on a given item
    sections.forEach(({ name, summary, template }) => {
      const section = htmlToElement('<section></section>')
      section.appendChild(htmlToElement(`<h2>${capitalize(name)}</h2>`))

      if (summary) section.appendChild(htmlToElement(summary()))

      // Go through all items related to this section
      Object.values(all[name]).forEach(item => {
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
