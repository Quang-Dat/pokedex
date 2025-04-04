// src/app/admin/add-pokemon/page.js (stránka pro přidání nového Pokémona)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPokemon() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Základní struktura nového Pokémona - bez ID, to se přidělí automaticky
  const [pokemon, setPokemon] = useState({
    name: {
      english: "",
      japanese: "",
      chinese: "",
      french: "",
    },
    type: [],
    base: {
      HP: 0,
      Attack: 0,
      Defense: 0,
      "Sp. Attack": 0,
      "Sp. Defense": 0,
      Speed: 0,
    },
    species: "",
    description: "",
    evolution: {},
    profile: {
      height: "",
      weight: "",
      egg: [],
      ability: [],
      gender: "",
    },
    image: {
      sprite: "",
      thumbnail: "",
      hires: "",
    },
  });
  // Pomocný stav pro práci s typy a vejci (které jsou pole)
  const [typeInput, setTypeInput] = useState("");
  const [eggInput, setEggInput] = useState("");
  const [abilityName, setAbilityName] = useState("");
  const [abilityHidden, setAbilityHidden] = useState("false");

  // Funkce pro aktualizaci hodnot v objektu pokemon
  const handleChange = (e, section, field) => {
    if (section) {
      setPokemon({
        ...pokemon,
        [section]: {
          ...pokemon[section],
          [field]: e.target.value,
        },
      });
    } else {
      setPokemon({
        ...pokemon,
        [field]: e.target.value,
      });
    }
  };

  // Funkce pro aktualizaci hodnot v base statistikách
  const handleBaseChange = (e, stat) => {
    setPokemon({
      ...pokemon,
      base: {
        ...pokemon.base,
        [stat]: parseInt(e.target.value) || 0,
      },
    });
  };

  // Přidání typu
  const addType = () => {
    if (typeInput && !pokemon.type.includes(typeInput)) {
      setPokemon({
        ...pokemon,
        type: [...pokemon.type, typeInput],
      });
      setTypeInput("");
    }
  };

  // Odebrání typu
  const removeType = (typeToRemove) => {
    setPokemon({
      ...pokemon,
      type: pokemon.type.filter((type) => type !== typeToRemove),
    });
  };

  // Přidání typu vejce
  const addEgg = () => {
    if (eggInput && !pokemon.profile.egg.includes(eggInput)) {
      setPokemon({
        ...pokemon,
        profile: {
          ...pokemon.profile,
          egg: [...pokemon.profile.egg, eggInput],
        },
      });
      setEggInput("");
    }
  };

  // Odebrání typu vejce
  const removeEgg = (eggToRemove) => {
    setPokemon({
      ...pokemon,
      profile: {
        ...pokemon.profile,
        egg: pokemon.profile.egg.filter((egg) => egg !== eggToRemove),
      },
    });
  };

  // Přidání schopnosti
  const addAbility = () => {
    if (abilityName) {
      setPokemon({
        ...pokemon,
        profile: {
          ...pokemon.profile,
          ability: [...pokemon.profile.ability, [abilityName, abilityHidden]],
        },
      });
      setAbilityName("");
      setAbilityHidden("false");
    }
  };

  // Odebrání schopnosti
  const removeAbility = (index) => {
    setPokemon({
      ...pokemon,
      profile: {
        ...pokemon.profile,
        ability: pokemon.profile.ability.filter((_, i) => i !== index),
      },
    });
  };

  // Odeslání formuláře
  // V souboru src/app/admin/add-pokemon/page.js upravte handleSubmit funkci:

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Kontrola povinných polí
      if (!pokemon.name.english || pokemon.type.length === 0) {
        throw new Error(
          "Vyplňte prosím povinná pole: anglický název a alespoň jeden typ"
        );
      }

      // Změna endpointu na /api/pokemon/create
      const res = await fetch("/api/pokemon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pokemon),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Nepodařilo se přidat Pokémona");
      }

      const data = await res.json();
      setSuccess(true);
      // Resetování formuláře nebo přesměrování
      setTimeout(() => {
        router.push(`/pokemon/${data.id}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Zpět na seznam
      </Link>

      <h1 className="text-3xl font-bold mb-6">Přidat nového Pokémona</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Pokémon byl úspěšně přidán! Přesměrování...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Základní informace */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Základní informace</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Anglický název *
              </label>
              <input
                type="text"
                value={pokemon.name.english}
                onChange={(e) => handleChange(e, "name", "english")}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Japonský název</label>
              <input
                type="text"
                value={pokemon.name.japanese}
                onChange={(e) => handleChange(e, "name", "japanese")}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Čínský název</label>
              <input
                type="text"
                value={pokemon.name.chinese}
                onChange={(e) => handleChange(e, "name", "chinese")}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Francouzský název
              </label>
              <input
                type="text"
                value={pokemon.name.french}
                onChange={(e) => handleChange(e, "name", "french")}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Druh</label>
              <input
                type="text"
                value={pokemon.species}
                onChange={(e) =>
                  setPokemon({ ...pokemon, species: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="např. Flame Pokémon"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Popis</label>
              <textarea
                value={pokemon.description}
                onChange={(e) =>
                  setPokemon({ ...pokemon, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Typy a statistiky */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Typy a statistiky</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Typy *</label>
              <div className="flex">
                <input
                  type="text"
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-l"
                  placeholder="např. Fire"
                />
                <button
                  type="button"
                  onClick={addType}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Přidat
                </button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {pokemon.type.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 rounded-full text-white bg-blue-500 flex items-center"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeType(type)}
                      className="ml-2 text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Základní statistiky</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">HP</label>
                <input
                  type="number"
                  value={pokemon.base.HP}
                  onChange={(e) => handleBaseChange(e, "HP")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Attack</label>
                <input
                  type="number"
                  value={pokemon.base.Attack}
                  onChange={(e) => handleBaseChange(e, "Attack")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Defense</label>
                <input
                  type="number"
                  value={pokemon.base.Defense}
                  onChange={(e) => handleBaseChange(e, "Defense")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Sp. Attack</label>
                <input
                  type="number"
                  value={pokemon.base["Sp. Attack"]}
                  onChange={(e) => handleBaseChange(e, "Sp. Attack")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Sp. Defense</label>
                <input
                  type="number"
                  value={pokemon.base["Sp. Defense"]}
                  onChange={(e) => handleBaseChange(e, "Sp. Defense")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Speed</label>
                <input
                  type="number"
                  value={pokemon.base.Speed}
                  onChange={(e) => handleBaseChange(e, "Speed")}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profil a obrázky */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profil</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Výška</label>
              <input
                type="text"
                value={pokemon.profile.height}
                onChange={(e) => handleChange(e, "profile", "height")}
                className="w-full px-3 py-2 border rounded"
                placeholder="např. 0.7 m"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Váha</label>
              <input
                type="text"
                value={pokemon.profile.weight}
                onChange={(e) => handleChange(e, "profile", "weight")}
                className="w-full px-3 py-2 border rounded"
                placeholder="např. 6.9 kg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Pohlaví (poměr)
              </label>
              <input
                type="text"
                value={pokemon.profile.gender}
                onChange={(e) => handleChange(e, "profile", "gender")}
                className="w-full px-3 py-2 border rounded"
                placeholder="např. 50:50 nebo Genderless"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Typy vajec</label>
              <div className="flex">
                <input
                  type="text"
                  value={eggInput}
                  onChange={(e) => setEggInput(e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-l"
                  placeholder="např. Monster"
                />
                <button
                  type="button"
                  onClick={addEgg}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Přidat
                </button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {pokemon.profile.egg.map((egg) => (
                  <span
                    key={egg}
                    className="px-3 py-1 rounded-full text-white bg-green-500 flex items-center"
                  >
                    {egg}
                    <button
                      type="button"
                      onClick={() => removeEgg(egg)}
                      className="ml-2 text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Schopnosti</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={abilityName}
                  onChange={(e) => setAbilityName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Název schopnosti"
                />
                <div className="flex items-center">
                  <label className="mr-4">Skrytá schopnost:</label>
                  <select
                    value={abilityHidden}
                    onChange={(e) => setAbilityHidden(e.target.value)}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="false">Ne</option>
                    <option value="true">Ano</option>
                  </select>
                  <button
                    type="button"
                    onClick={addAbility}
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Přidat
                  </button>
                </div>
              </div>
              <div className="mt-2">
                {pokemon.profile.ability.map((ability, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1"
                  >
                    <span>
                      {ability[0]} {ability[1] === "true" ? "(skrytá)" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAbility(index)}
                      className="text-red-500"
                    >
                      Odebrat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Obrázky (URL)</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sprite URL</label>
              <input
                type="url"
                value={pokemon.image.sprite}
                onChange={(e) => handleChange(e, "image", "sprite")}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://example.com/sprite.png"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Thumbnail URL</label>
              <input
                type="url"
                value={pokemon.image.thumbnail}
                onChange={(e) => handleChange(e, "image", "thumbnail")}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://example.com/thumbnail.png"
              />
              {pokemon.image.thumbnail && (
                <div className="mt-2">
                  <img
                    src={pokemon.image.thumbnail}
                    alt="Náhled miniatury"
                    className="h-16 w-16 object-contain border"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/64?text=Error")
                    }
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Hires URL (velký obrázek)
              </label>
              <input
                type="url"
                value={pokemon.image.hires}
                onChange={(e) => handleChange(e, "image", "hires")}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://example.com/hires.png"
              />
              {pokemon.image.hires && (
                <div className="mt-2">
                  <img
                    src={pokemon.image.hires}
                    alt="Náhled velkého obrázku"
                    className="h-32 w-32 object-contain border"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/128?text=Error")
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Ukládání..." : "Přidat Pokémona"}
          </button>
        </div>
      </form>
    </div>
  );
}
