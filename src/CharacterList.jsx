import axios from "axios";
import { useEffect, useState } from "react";

export function CharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    async function fetchAllCharacters() {
      try {
        // ustawiamy bardzo duży limit
        const response = await axios.get(
          "https://dattebayo-api.onrender.com/characters",
          {
            params: { limit: 9999 },
          }
        );

        console.log(response.data);
        setCharacters(response.data.characters || []);
      } catch (error) {
        console.error("Błąd podczas pobierania postaci:", error);
      }
    }

    fetchAllCharacters();
  }, []);

  return (
    <div>
      <h1>Lista wszystkich postaci Naruto</h1>
      {characters.length === 0 ? (
        <p>Ładowanie danych...</p>
      ) : (
        <ul>
          {characters.map((char, index) => (
            <li key={char.id || index}>
              {char.name}
              <img src={char.images[0]} alt={char.name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
