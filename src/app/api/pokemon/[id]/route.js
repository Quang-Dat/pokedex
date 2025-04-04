import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

export async function GET(request, { params }) {
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

    const pokemon = await db.collection("pokedex").findOne({ id: id });

    if (!pokemon) {
      return NextResponse.json(
        { error: "Pokémon nebyl nalezen" },
        { status: 404 }
      );
    }

    return NextResponse.json(pokemon);
  } catch (e) {
    console.error("Chyba při načítání dat:", e);
    return NextResponse.json(
      {
        error: "Nepodařilo se načíst data z databáze",
        message: e.message,
      },
      { status: 500 }
    );
  }
}
