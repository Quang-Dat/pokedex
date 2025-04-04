// src/app/api/pokemon/create/route.js
import { clientPromise } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const pokemonData = await request.json();
    const client = await clientPromise;
    const db = client.db("pokemons");

    // Najít Pokémona s nejvyšším ID
    const lastPokemon = await db
      .collection("pokedex") // Změněno z "pokemons" na "pokedex" pro konzistenci
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    // Pokud existuje alespoň jeden Pokémon, nastavit ID na poslední ID + 1, jinak nastavit ID na 1
    const lastId = lastPokemon.length > 0 ? lastPokemon[0].id : 0;
    const newId = lastId + 1;

    // Nastavit nové ID pro Pokémona
    const pokemon = {
      ...pokemonData,
      id: newId,
    };

    // Validace povinných polí
    if (!pokemon.name.english || pokemon.type.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Chybí povinná pole: anglický název nebo typ",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Vložení nového Pokémona do databáze
    const result = await db.collection("pokedex").insertOne(pokemon);

    return new Response(
      JSON.stringify({
        message: "Pokémon byl úspěšně přidán",
        id: newId,
        pokemon: pokemon,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chyba při přidávání Pokémona:", error);
    return new Response(
      JSON.stringify({
        message: "Chyba při přidávání Pokémona",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
