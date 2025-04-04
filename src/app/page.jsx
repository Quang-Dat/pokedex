"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Přidáno

export default function Home() {
  const router = useRouter(); // Přidáno
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Funkce pro přesměrování na detail Pokémona
  const navigateToPokemon = (id) => {
    router.push(`/pokemon/${id}`);
  };

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const res = await fetch("/api/pokemon");
        if (!res.ok) {
          throw new Error("Nepodařilo se načíst data");
        }
        const data = await res.json();
        setPokemons(data);

        // Extrahování unikátních typů
        const allTypes = new Set();
        data.forEach((pokemon) => {
          if (pokemon.type && Array.isArray(pokemon.type)) {
            pokemon.type.forEach((type) => allTypes.add(type));
          }
        });
        setPokemonTypes(Array.from(allTypes).sort());

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  // Použití useMemo pro optimalizaci filtrování
  const filteredPokemons = useMemo(() => {
    let filtered = pokemons;

    // Filtrování podle vyhledávacího výrazu
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((pokemon) =>
        pokemon.name.english.toLowerCase().includes(searchLower)
      );
    }

    // Filtrování podle vybraných typů
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) => {
        if (!pokemon.type || !Array.isArray(pokemon.type)) return false;
        return selectedTypes.every((type) => pokemon.type.includes(type));
      });
    }

    return filtered;
  }, [pokemons, searchTerm, selectedTypes]);

  const handleTypeClick = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <div>Načítání...</div>;
  if (error) return <div>Chyba: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>

      {/* Vyhledávací pole */}
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Vyhledat Pokémona podle jména..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tlačítka pro filtrování podle typu */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filtrovat podle typu:</h2>
        <div className="flex flex-wrap gap-2">
          {pokemonTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white transition-all ${
                selectedTypes.includes(type)
                  ? "ring-4 ring-blue-700 font-bold"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {type}
            </button>
          ))}
          {(selectedTypes.length > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-300 text-black hover:bg-gray-400"
            >
              Zrušit filtry
            </button>
          )}
        </div>
      </div>

      {/* Zobrazení počtu nalezených Pokémonů */}
      <p className="mb-4 font-bold">
        Nalezeno: {filteredPokemons.length} Pokémonů
        {selectedTypes.length > 0 ? ` typů ${selectedTypes.join(" + ")}` : ""}
        {searchTerm ? ` obsahujících "${searchTerm}"` : ""}
      </p>

      {/* Seznam Pokémonů */}
      {filteredPokemons.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToPokemon(pokemon.id)} // Přidáno
            >
              <img
                src={pokemon.image.thumbnail}
                alt={pokemon.name.english}
                className="mx-auto h-32 w-32 object-contain"
              />
              <h2 className="text-center mt-2 font-semibold">
                {pokemon.name.english}
              </h2>
              <p className="text-center text-gray-500">#{pokemon.id}</p>
              <div className="flex justify-center mt-2 gap-1">
                {pokemon.type.map((type) => (
                  <span
                    key={`${pokemon.id}-${type}`}
                    className="px-2 py-0.5 rounded-full text-xs bg-gray-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">Žádní Pokémoni nebyli nalezeni.</p>
        </div>
      )}
    </div>
  );
}
