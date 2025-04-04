import Image from "next/image";

export default function PokemonDetail({ pokemon }) {
  return (
    <div className="pokemon-detail">
      <div className="image-container">
        <Image
          src={pokemon.image.hires}
          alt={pokemon.name.english}
          width={300}
          height={300}
          layout="responsive"
        />
      </div>

      <div className="info">
        <h1>{pokemon.name.english}</h1>
        <p className="id">#{pokemon.id.toString().padStart(3, "0")}</p>

        <div className="types">
          {pokemon.type.map((type) => (
            <span key={type} className={`type ${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>

        <div className="description">
          <p>{pokemon.description || "Popis není k dispozici."}</p>
        </div>

        <div className="stats">
          <h2>Statistiky</h2>
          {pokemon.base &&
            Object.entries(pokemon.base).map(([stat, value]) => (
              <div key={stat} className="stat">
                <span className="stat-name">{stat}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${(value / 255) * 100}%` }}
                  ></div>
                </div>
                <span className="stat-value">{value}</span>
              </div>
            ))}
        </div>

        <div className="profile">
          <h2>Profil</h2>
          <div className="profile-grid">
            <div>
              <h3>Výška</h3>
              <p>{pokemon.profile?.height || "N/A"}</p>
            </div>
            <div>
              <h3>Váha</h3>
              <p>{pokemon.profile?.weight || "N/A"}</p>
            </div>
            <div>
              <h3>Druh</h3>
              <p>{pokemon.species || "N/A"}</p>
            </div>
            <div>
              <h3>Schopnosti</h3>
              <ul>
                {pokemon.profile?.ability?.map((ability) => (
                  <li key={ability[0]}>{ability[0]}</li>
                )) || "N/A"}
              </ul>
            </div>
          </div>
        </div>

        {pokemon.evolution && (
          <div className="evolution">
            <h2>Evoluce</h2>
            {pokemon.evolution.prev && (
              <p>
                Předchozí: #{pokemon.evolution.prev[0]} (Level{" "}
                {pokemon.evolution.prev[1]})
              </p>
            )}
            {pokemon.evolution.next &&
              pokemon.evolution.next.map((next, index) => (
                <p key={index}>
                  Další: #{next[0]} (Level {next[1]})
                </p>
              ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .pokemon-detail {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        .image-container {
          background-color: #f5f5f5;
          border-radius: 20px;
          padding: 2rem;
        }
        .info h1 {
          margin: 0;
          font-size: 2.5rem;
        }
        .id {
          color: #666;
          font-size: 1.5rem;
          margin: 0.5rem 0 1rem;
        }
        .types {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .type {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: bold;
        }
        .description {
          margin: 1.5rem 0;
          line-height: 1.6;
        }
        .stats,
        .profile,
        .evolution {
          margin: 2rem 0;
        }
        .stat {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .stat-name {
          width: 100px;
        }
        .stat-bar {
          flex: 1;
          height: 10px;
          background-color: #eee;
          border-radius: 5px;
          overflow: hidden;
          margin: 0 1rem;
        }
        .stat-fill {
          height: 100%;
          background-color: #0070f3;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .profile-grid h3 {
          margin: 0 0 0.5rem;
          color: #666;
        }
        .profile-grid p,
        .profile-grid ul {
          margin: 0;
        }

        /* Typy Pokémonů */
        .normal {
          background-color: #a8a878;
        }
        .fire {
          background-color: #f08030;
        }
        .water {
          background-color: #6890f0;
        }
        .grass {
          background-color: #78c850;
        }
        .electric {
          background-color: #f8d030;
        }
        .ice {
          background-color: #98d8d8;
        }
        .fighting {
          background-color: #c03028;
        }
        .poison {
          background-color: #a040a0;
        }
        .ground {
          background-color: #e0c068;
        }
        .flying {
          background-color: #a890f0;
        }
        .psychic {
          background-color: #f85888;
        }
        .bug {
          background-color: #a8b820;
        }
        .rock {
          background-color: #b8a038;
        }
        .ghost {
          background-color: #705898;
        }
        .dark {
          background-color: #705848;
        }
        .dragon {
          background-color: #7038f8;
        }
        .steel {
          background-color: #b8b8d0;
        }
        .fairy {
          background-color: #ee99ac;
        }

        @media (max-width: 768px) {
          .pokemon-detail {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
