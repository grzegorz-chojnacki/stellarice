const all = { pop, traits, origin, ethics, authority, civics }

const empire = {
  pop: [pop.Biological],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}

const sections = [
  {
    name: 'pop',
    template: sectionTemplate('radio', itemAttrributes)
  },
  {
    name: 'traits',
    summary: () => `
      <p>
        Available traits: ${5 - empire.traits.length}<br>
        Available points: ${empire.traits.reduce(Trait.costSum, 2)}
      </p>`,
    template: sectionTemplate('checkbox', traitAttrributes,
      item => `[<span class="trait-point">${item.value}</span>] `)
  },
  {
    name: 'origin',
    template: sectionTemplate('checkbox', itemAttrributes)
  },
  {
    name: 'ethics',
    template: sectionTemplate('checkbox', itemAttrributes)
  },
  {
    name: 'authority',
    template: sectionTemplate('radio', itemAttrributes)
  },
  {
    name: 'civics',
    template: sectionTemplate('checkbox', itemAttrributes)
  },
]

const getColor = item => {
  if (item instanceof Pop) {
    return ({
      Biological: 'tacao',
      Botanic: 'rosebud',
      Lithoid: 'apricot',
      Mechanical: 'turquoise',
    })[item.id]
  } else if (item instanceof Trait) {
    if (nestedIn(traitsBotanic, item)) return 'rosebud'
    else if (nestedIn(traitsLithoid, item)) return 'apricot'
    else if (item.value > 0) return 'turquoise'
    else if (item.value < 0) return 'cranberry'
    return null
  } else if (item instanceof Origin) {
    return 'tacao'
  } else if (item instanceof Ethic) {
    if (item.id.startsWith('Fanatic')) return 'cranberry'
    else if (item.id.startsWith('Gestalt')) return 'tacao'
    return 'apricot'
  } else if (item instanceof Authority) {
    return ({
      Imperial:            'cranberry',
      Dictatorial:         'apricot',
      Oligarchic:          'rosebud',
      Democratic:          'tacao',
      Corporate:           'tacao',
      HiveMind:            'lavender',
      MachineIntelligence: 'turquoise',
    })[item.id]
  } else if (item instanceof Civic) {
    if (nestedIn(civicsCorporate, item)) return 'rosebud'
    else if (nestedIn(civicsHive, item)) return 'lavender'
    else if (nestedIn(civicsMachine, item)) return 'turquoise'
    return 'apricot'
  }

  return null
}

const main = document.getElementsByTagName('main')[0]

const render = () => {
  main.innerHTML = ''
  sections.forEach(({ name, summary, template }) => {
    const section = htmlToElement('<section></section>')
    section.appendChild(htmlToElement(`<h2>${capitalize(name)}</h2>`))

    if (summary) {
      section.appendChild(htmlToElement(summary()))
    }

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

render()
