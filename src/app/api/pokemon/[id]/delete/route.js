// src/app/api/pokemon/[id]/delete/route.js
import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Neplatné ID Pokémona" },
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

    // Odstranění Pokémona
    const result = await db.collection("pokedex").deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Pokémon nebyl odstraněn" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Pokémon byl úspěšně odstraněn",
        id: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chyba při odstraňování Pokémona:", error);
    return NextResponse.json(
      {
        error: "Nepodařilo se odstranit Pokémona",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
