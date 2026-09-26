import axios from 'axios'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    loadAllPokemon()
  }, [])

  function loadAllPokemon() {
    setLoading(true)

    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((response) => {
        setPokemons(response.data.results)
        setLoading(false)

        axios
          .get(response.data.results[0].url)
          .then((response) => {
            setSelectedPokemon(response.data)
          })
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  function selectPokemon(pokemon) {
    setDetailsLoading(true)

    axios
      .get(pokemon.url)
      .then((response) => {
        setSelectedPokemon(response.data)
        setDetailsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setDetailsLoading(false)
      })
  }

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <div className="pokeball">
              <div className="pokeball-button"></div>
            </div>
          </div>

          <div>
            <h1>POKÉDEX</h1>
            <span>POKÉMON DATABASE</span>
          </div>

        </div>

        <div className="side-divider"></div>

        <nav className="navigation">

          <p className="nav-label">DATABASE</p>

          <div className="nav-item active">
            <span className="nav-icon">◇</span>
            <span>Pokémon</span>
          </div>

        </nav>

        <div className="sidebar-database">

          <div className="database-header">
            <span>DATABASE STATUS</span>
            <span className="online-dot"></span>
          </div>

          <strong>1025</strong>

          <p>Pokémon Registered</p>

          <div className="database-bar">
            <div></div>
          </div>

          <small>POKÉAPI CONNECTION ACTIVE</small>

        </div>

        <div className="sidebar-footer">
          <span>POKÉDEX SYSTEM</span>
          <strong>v2.0</strong>
        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div className="topbar-title">

            <div className="eyebrow">
              <span className="status-light"></span>
              SYSTEM ONLINE
            </div>

            <h2>Pokémon Database</h2>

          </div>

          <div className="search-wrapper">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

          </div>

        </header>

        {loading ? (

          <div className="loading">

            <div className="loader"></div>

            <p>Initializing Pokédex...</p>

          </div>

        ) : (

          <div className="pokemon-page">

            <div className="database-heading">

              <div>
                <span>POKÉMON DATABASE / SPECIES INDEX</span>

                <h1>Explore the Pokémon World</h1>

                <p>
                  {filteredPokemons.length} Pokémon
                  available in the Pokédex.
                </p>
              </div>

              <div className="database-status-card">
                <span>DATABASE</span>
                <strong>1025</strong>
                <small>REGISTERED</small>
              </div>

            </div>

            <div className="pokemon-layout">

              <section className="pokemon-list-section">

                <div className="list-top">

                  <div>
                    <span>SPECIES INDEX</span>

                    <strong>
                      {filteredPokemons.length}
                    </strong>
                  </div>

                  <span>
                    SELECT A SPECIES
                  </span>

                </div>

                <div className="pokemon-list">

                  {filteredPokemons.map((pokemon) => {

                    const id = pokemon.url
                      .split('/')
                      .filter(Boolean)
                      .pop()

                    return (

                      <button
                        className={`pokemon-row ${
                          selectedPokemon?.id === Number(id)
                            ? 'selected'
                            : ''
                        }`}
                        key={`${pokemon.name}-${id}`}
                        onClick={() =>
                          selectPokemon(pokemon)
                        }
                      >

                        <div className="row-number">
                          #{String(id).padStart(3, '0')}
                        </div>

                        <div className="row-image">

                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                            alt={pokemon.name}
                          />

                        </div>

                        <div className="row-info">

                          <span>SPECIES</span>

                          <h3>
                            {capitalize(pokemon.name)}
                          </h3>

                        </div>

                        <div className="row-arrow">
                          →
                        </div>

                      </button>

                    )
                  })}

                </div>

              </section>

              <section className="details-section">

                {detailsLoading ? (

                  <div className="details-loading">

                    <div className="loader"></div>

                    <p>
                      Scanning Pokémon data...
                    </p>

                  </div>

                ) : selectedPokemon ? (

                  <PokemonCard
                    pokemon={selectedPokemon}
                  />

                ) : (

                  <div className="no-selection">

                    <div>◇</div>

                    <h2>Select a Pokémon</h2>

                    <p>
                      Choose a Pokémon from the database
                      to inspect its data.
                    </p>

                  </div>

                )}

              </section>

            </div>

          </div>

        )}

      </main>

    </div>
  )
}

function PokemonCard({ pokemon }) {

  const type = pokemon.types[0].type.name

  const artwork =
    pokemon.sprites.other['official-artwork'].front_default

  const maxStat = 150

  const totalStats = pokemon.stats.reduce(
    (total, stat) => total + stat.base_stat,
    0
  )

  const averageStat = Math.round(
    totalStats / pokemon.stats.length
  )

  return (

    <div
      className={`pokemon-card-display ${type}`}
      style={{
        '--type-color': getTypeColor(type),
        '--type-glow': getTypeGlow(type)
      }}
    >

      <div className="card-holo"></div>

      <div className="card-pattern"></div>

      <div className="card-top">

        <div>

          <span className="card-species">
            SPECIES ENTRY
          </span>

          <h2>
            {capitalize(pokemon.name)}
          </h2>

        </div>

        <div className="card-id">
          #{String(pokemon.id).padStart(3, '0')}
        </div>

      </div>

      <div className="card-art">

        <div className="art-ring"></div>

        <div className="art-ring ring-two"></div>

        <div className="art-glow"></div>

        <img
          src={artwork}
          alt={pokemon.name}
        />

        <div className="card-art-label">
          POKÉDEX VERIFIED
        </div>

      </div>

      <div className="card-types">

        {pokemon.types.map((item) => (

          <span
            key={item.type.name}
            className={`type-badge ${item.type.name}`}
          >
            {getTypeSymbol(item.type.name)}
            {item.type.name}
          </span>

        ))}

      </div>

      <div className="card-info-grid">

        <div className="info-box">
          <span>HEIGHT</span>
          <strong>
            {pokemon.height / 10} m
          </strong>
        </div>

        <div className="info-box">
          <span>WEIGHT</span>
          <strong>
            {pokemon.weight / 10} kg
          </strong>
        </div>

        <div className="info-box">
          <span>BASE EXP</span>
          <strong>
            {pokemon.base_experience}
          </strong>
        </div>

      </div>

      <div className="stats-section">

        <div className="stats-header">

          <div>
            <span className="section-label">
              BASE STAT ANALYSIS
            </span>

            <h3>Power Profile</h3>
          </div>

          <div className="stat-summary">

            <strong>{totalStats}</strong>

            <span>TOTAL</span>

          </div>

        </div>

        <div className="average-stat">

          <span>AVERAGE STAT</span>

          <strong>{averageStat}</strong>

          <div className="average-bar">
            <div
              style={{
                width: `${Math.min(
                  (averageStat / maxStat) * 100,
                  100
                )}%`
              }}
            ></div>
          </div>

        </div>

        <div className="stat-list">

          {pokemon.stats.map((stat) => {

            const percentage = Math.min(
              (stat.base_stat / maxStat) * 100,
              100
            )

            return (

              <div
                className="stat-row"
                key={stat.stat.name}
              >

                <div className="stat-label">

                  <span>
                    {formatStatName(stat.stat.name)}
                  </span>

                  <strong>
                    {stat.base_stat}
                  </strong>

                </div>

                <div className="stat-bar">

                  <div
                    style={{
                      width: `${percentage}%`
                    }}
                  ></div>

                </div>

              </div>

            )
          })}

        </div>

      </div>

      <div className="abilities-section">

        <div className="stats-header">

          <div>
            <span className="section-label">
              ABILITIES
            </span>

            <h3>Known Skills</h3>
          </div>

          <span className="ability-count">
            {pokemon.abilities.length} SKILLS
          </span>

        </div>

        <div className="abilities-list">

          {pokemon.abilities.map((ability) => (

            <div
              className="ability-chip"
              key={ability.ability.name}
            >

              <span>✦</span>

              {ability.ability.name}

            </div>

          ))}

        </div>

      </div>

      <div className="card-footer">

        <span>
          POKÉDEX DATABASE
        </span>

        <span>
          ID {String(pokemon.id).padStart(3, '0')}
        </span>

      </div>

    </div>

  )
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function formatStatName(name) {
  return name
    .replace('-', ' ')
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

function getTypeSymbol(type) {

  const symbols = {
    normal: '●',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄',
    fighting: '✊',
    poison: '☠',
    ground: '◈',
    flying: '◆',
    psychic: '◉',
    bug: '♢',
    rock: '⬢',
    ghost: '☾',
    dragon: '🐉',
    dark: '◐',
    steel: '⚙',
    fairy: '✦'
  }

  return symbols[type] || '●'
}

function getTypeColor(type) {

  const colors = {
    normal: '#a8a77a',
    fire: '#ff7043',
    water: '#42a5f5',
    electric: '#ffd740',
    grass: '#66bb6a',
    ice: '#80deea',
    fighting: '#ef5350',
    poison: '#ab47bc',
    ground: '#c9a227',
    flying: '#7986cb',
    psychic: '#ec407a',
    bug: '#9ccc65',
    rock: '#a1887f',
    ghost: '#7e57c2',
    dragon: '#5c6bc0',
    dark: '#78909c',
    steel: '#90a4ae',
    fairy: '#f48fb1'
  }

  return colors[type] || '#655eff'
}

function getTypeGlow(type) {

  const colors = {
    normal: 'rgba(168,167,122,0.4)',
    fire: 'rgba(255,112,67,0.45)',
    water: 'rgba(66,165,245,0.45)',
    electric: 'rgba(255,215,64,0.45)',
    grass: 'rgba(102,187,106,0.45)',
    ice: 'rgba(128,222,234,0.45)',
    fighting: 'rgba(239,83,80,0.45)',
    poison: 'rgba(171,71,188,0.45)',
    ground: 'rgba(201,162,39,0.45)',
    flying: 'rgba(121,134,203,0.45)',
    psychic: 'rgba(236,64,122,0.45)',
    bug: 'rgba(156,204,101,0.45)',
    rock: 'rgba(161,136,127,0.45)',
    ghost: 'rgba(126,87,194,0.45)',
    dragon: 'rgba(92,107,192,0.45)',
    dark: 'rgba(120,144,156,0.45)',
    steel: 'rgba(144,164,174,0.45)',
    fairy: 'rgba(244,143,177,0.45)'
  }

  return colors[type] || 'rgba(101,94,255,0.4)'
}

export default App