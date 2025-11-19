import axios from "axios";
import { useEffect, useState } from "react";

export function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
          {characters.map((char, index) => {
            const key = char.id ?? index;
            const isOpen = expandedId === key;

            function toggle() {
              setExpandedId((prev) => (prev === key ? null : key));
            }

            function renderValue(value) {
              if (value === null) return <span>null</span>;
              if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
              )
                return <span>{String(value)}</span>;
              return (
                <pre style={{ whiteSpace: "pre-wrap", maxWidth: 600 }}>
                  {JSON.stringify(value, null, 2)}
                </pre>
              );
            }

            return (
              <li key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ flex: "0 0 auto" }}>
                    <img
                      src={char.images?.[0] ?? "/placeholder.svg"}
                      alt={char.name ?? ""}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      style={{
                        maxWidth: "120px",
                        height: "auto",
                        borderRadius: 6,
                      }}
                    />
                  </div>

                  <div style={{ flex: "1 1 auto" }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      {char.name ?? "—"}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={toggle}>
                        {isOpen ? "Pokaż mniej" : "Pokaż więcej"}
                      </button>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      background: "#f8fafc",
                      borderRadius: 6,
                    }}
                  >
                    {Object.keys(char).length === 0 ? (
                      <div>Brak dodatkowych informacji.</div>
                    ) : (
                      <div>
                        {Object.entries(char).map(([k, v]) => (
                          <div key={k} style={{ marginBottom: 8 }}>
                            <strong style={{ textTransform: "capitalize" }}>
                              {k}:
                            </strong>
                            <div>{renderValue(v)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
