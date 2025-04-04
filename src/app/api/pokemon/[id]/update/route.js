// src/app/api/pokemon/[id]/update/route.js
import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Neplatné ID Pokémona" },
        { status: 400 }
      );
    }

    let pokemonData = await request.json();

    // Kontrola, zda ID v datech odpovídá ID v URL
    if (pokemonData.id !== id) {
      return NextResponse.json(
        { error: "ID v datech neodpovídá ID v URL" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pokemons");

    // Kontrola, zda Pokémon existuje
    const existingPokemon = await db.collection("pokedex").findOne({ id: id });
    if (!existingPokemon) {
      return NextResponse.json(
        { error: "Pokémon nebyl nalezen" },
        { status: 404 }
      );
    }

    // DŮLEŽITÉ: Odstranění pole _id z dat před aktualizací
    if (pokemonData._id) {
      delete pokemonData._id;
    }

    // Aktualizace Pokémona
    const result = await db
      .collection("pokedex")
      .updateOne({ id: id }, { $set: pokemonData });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Žádné změny nebyly provedeny" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Pokémon byl úspěšně aktualizován",
        id: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chyba při aktualizaci Pokémona:", error);
    return NextResponse.json(
      {
        error: "Nepodařilo se aktualizovat Pokémona",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
