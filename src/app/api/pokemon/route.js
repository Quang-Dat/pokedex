// app/api/pokemon/route.js
import { clientPromise } from "@/lib/mongodb";

export async function GET(request) {
  try {
    console.log("Pokus o připojení k MongoDB...");
    const client = await clientPromise;
    console.log("Klient získán, připojuji se k databázi...");

    // Připojení k databázi
    const db = client.db("pokemons");
    console.log("Připojeno k databázi 'pokemons'");

    // Kontrola existence kolekce
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col) => col.name === "pokedex");

    if (!collectionExists) {
      console.error("Kolekce 'pokedex' neexistuje!");
      return new Response(
        JSON.stringify({ error: "Kolekce 'pokedex' nebyla nalezena" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Získání dat z kolekce
    const pokemons = await db
      .collection("pokedex")
      .find({})
      .project({
        id: 1,
        "name.english": 1,
        "image.thumbnail": 1,
        type: 1,
        _id: 0, // Vyloučení `_id`
      })
      .sort({ id: 1 })
      .toArray();

    console.log(`Načteno ${pokemons.length} Pokémonů`);

    // Pokud nejsou žádná data, vrátíme prázdné pole
    if (!pokemons.length) {
      console.log("Žádní Pokémoni nebyli nalezeni");
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vrácení dat
    return new Response(JSON.stringify(pokemons), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chyba při načítání dat:", error);
    return new Response(
      JSON.stringify({
        error: "Nepodařilo se načíst data z databáze",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
