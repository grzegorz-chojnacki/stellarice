const template = {
  ethics: [],
  traits: [],
  civics: [],
  authority: [],
  origin: [],
  pop: []
}

const all = { pop, traits, origin, ethics, authority, civics }

const empire = deepCopy(template)

const sections = [
  {
    name: 'pop',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.id}"
          name="${item.id}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">${item.name}</label>
      </div>`
  },
  {
    name: 'traits',
    summary: () => `
      <p>
        Available traits: ${5 - empire.traits.length}<br>
        Available points: ${empire.traits.reduce(Trait.costSum, 2)}
      </p>`,
    template: item => `
      <div ${hidden(item)}>
        <input
          type="checkbox"
          id="${item.id}"
          name="${item.id}"
          ${isOrigin(item)}
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">
          [<span class="trait-point">${item.value}</span>]
          ${item.name}
        </label>
      </div>`
  },
  {
    name: 'origin',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.id}"
          name="${item.id}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">${item.name}</label>
      </div>`
  },
  {
    name: 'ethics',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.id}"
          name="${item.id}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">${item.name}</label>
      </div>`
  },
  {
    name: 'authority',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.id}"
          name="${item.id}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">${item.name}</label>
      </div>`
  },
  {
    name: 'civics',
    template: item => `
      <div ${hidden(item)}>
        <input
          type="checkbox"
          id="${item.id}"
          name="${item.id}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.id}">${item.name}</label>
      </div>`
  },
]

const getColor = item => {
  if (nestedIn(all.pop, item)) {
    return ({
      Biological: 'tacao',
      Botanic: 'rosebud',
      Lithoid: 'apricot',
      Mechanical: 'turquoise',
    })[item.id]
  } else if (nestedIn(all.traits, item)) {
    if (nestedIn(traitsBotanic, item)) return 'rosebud'
    else if (nestedIn(traitsLithoid, item)) return 'apricot'
    else if (item.value > 0) return 'turquoise'
    else if (item.value < 0) return 'cranberry'
    return null
  } else if (nestedIn(all.origin, item)) {
    return 'tacao'
  } else if (nestedIn(all.ethics, item)) {
    if (item.id.startsWith('Fanatic')) return 'cranberry'
    else if (item.id.startsWith('Gestalt')) return 'tacao'
    return 'apricot'
  } else if (nestedIn(all.authority, item)) {
    return ({
      Imperial:            'cranberry',
      Dictatorial:         'apricot',
      Oligarchic:          'rosebud',
      Democratic:          'tacao',
      Corporate:           'tacao',
      HiveMind:            'lavender',
      MachineIntelligence: 'turquoise',
    })[item.id]
  } else if (nestedIn(all.civics, item)) {
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
