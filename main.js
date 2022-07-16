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
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
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
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">
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
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'ethics',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'authority',
    template: item => `
      <div>
        <input
          type="radio"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
  {
    name: 'civics',
    template: item => `
      <div>
        <input
          type="checkbox"
          id="${item.name}"
          name="${item.name}"
          ${checked(item)}
          ${invalid(item)}
          ${disabled(item)}>
        <label for="${item.name}">${item.name}</label>
      </div>`
  },
]

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
      section.appendChild(element)
    })

    main.appendChild(section)
  })
}

render()
