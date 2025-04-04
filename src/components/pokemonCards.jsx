import Link from "next/link";
import Image from "next/image";

export default function PokemonCard({ pokemon }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="card">
        <div className="image-container">
          <Image
            src={pokemon.image.thumbnail}
            alt={pokemon.name.english}
            width={120}
            height={120}
            layout="responsive"
          />
        </div>
        <h2>{pokemon.name.english}</h2>
        <p>#{pokemon.id.toString().padStart(3, "0")}</p>

        <style jsx>{`
          .card {
            border: 1px solid #eaeaea;
            border-radius: 10px;
            padding: 1rem;
            margin: 0.5rem;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          .image-container {
            background-color: #f5f5f5;
            border-radius: 50%;
            padding: 1rem;
            margin-bottom: 1rem;
          }
          h2 {
            margin: 0.5rem 0;
            font-size: 1.2rem;
          }
          p {
            color: #666;
            margin: 0;
          }
        `}</style>
      </div>
    </Link>
  );
}
