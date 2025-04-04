// src/app/pokemon/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PokemonDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(`/api/pokemon/${id}`);
        if (!res.ok) {
          throw new Error("Nepodařilo se načíst data");
        }
        const data = await res.json();
        setPokemon(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/pokemon/${id}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Nepodařilo se odstranit Pokémona"
        );
      }

      // Přesměrování na hlavní stránku po úspěšném odstranění
      router.push("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div>Načítání...</div>;
  if (error) return <div>Chyba: {error}</div>;
  if (!pokemon) return <div>Pokémon nebyl nalezen</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline inline-block">
          &larr; Zpět na seznam
        </Link>

        <div className="flex space-x-2">
          <Link
            href={`/pokemon/${id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Upravit Pokémona
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Odstranit Pokémona
          </button>
        </div>
      </div>

      {/* Potvrzovací dialog pro odstranění */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Potvrzení odstranění</h2>
            <p className="mb-6">
              Opravdu chcete odstranit Pokémona{" "}
              <strong>{pokemon.name.english}</strong> (#{pokemon.id})? Tato akce
              je nevratná.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
                disabled={deleting}
              >
                Zrušit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                disabled={deleting}
              >
                {deleting ? "Odstraňování..." : "Odstranit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img
              src={pokemon.image.hires}
              alt={pokemon.name.english}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold">{pokemon.name.english}</h1>
            <p className="text-gray-500">#{pokemon.id}</p>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Typy</h2>
              <div className="flex mt-2 space-x-2">
                {pokemon.type.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 rounded-full text-white bg-blue-500"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Základní statistiky</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(pokemon.base).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between">
                    <span>{stat}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {pokemon.description && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Popis</h2>
                <p className="mt-2">{pokemon.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
