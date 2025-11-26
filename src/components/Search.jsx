import axios from "axios";
import { useState, useEffect } from "react";
import shuriken from "../static/sn.png";

const BASE_URL = "https://dattebayo-api.onrender.com";

const COLLECTIONS = [
  "characters",
  "clans",
  "villages",
  "kekkei-genkai",
  "tailed-beasts",
  "teams",
  "akatsuki",
  "kara",
];

const FIELDS = ["name", "height", "family", "jutsu", "naturetype"];

export function Search() {
  const [collection, setCollection] = useState("all");
  const [field, setField] = useState("id");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  async function fetchCollection(name) {
    try {
      const res = await axios.get(`${BASE_URL}/${name}`, {
        params: { limit: 9999 },
      });
      // API often returns { <collectionName>: [...] } or { items: [...] } or data directly
      if (res?.data) {
        // prefer res.data[name] if present
        if (Array.isArray(res.data[name])) return res.data[name];
        // else if there's an items/collection key
        const array = Object.values(res.data).find((v) => Array.isArray(v));
        if (Array.isArray(array)) return array;
        // if data itself is array
        if (Array.isArray(res.data)) return res.data;
      }
      return [];
    } catch (err) {
      // propagate error to caller
      throw err;
    }
  }

  function matchItemByField(item, fieldKey, q) {
    if (!q) return true; // empty query matches everything
    const lowerQ = String(q).toLowerCase();

    function getFieldDeepValue(obj, key) {
      if (obj == null) return undefined;
      if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
      // search one level deep in plain objects
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          if (Object.prototype.hasOwnProperty.call(v, key)) return v[key];
        }
      }
      // also search arrays of objects
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (Array.isArray(v)) {
          for (const el of v) {
            if (
              el &&
              typeof el === "object" &&
              Object.prototype.hasOwnProperty.call(el, key)
            )
              return el[key];
          }
        }
      }
      return undefined;
    }

    if (!fieldKey) {
      // search across all primitive fields and JSON-stringified nested ones
      for (const k of Object.keys(item)) {
        const v = item[k];
        if (v == null) continue;
        if (
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
        ) {
          if (String(v).toLowerCase().includes(lowerQ)) return true;
        } else {
          try {
            if (JSON.stringify(v).toLowerCase().includes(lowerQ)) return true;
          } catch (e) { }
        }
      }
      return false;
    }

    const value = getFieldDeepValue(item, fieldKey);
    if (value == null) return false;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      // if query is numeric and value is numeric, compare by equality
      if (!Number.isNaN(Number(lowerQ)) && !Number.isNaN(Number(value))) {
        return Number(value) === Number(lowerQ);
      }
      return String(value).toLowerCase().includes(lowerQ);
    }

    try {
      return JSON.stringify(value).toLowerCase().includes(lowerQ);
    } catch (e) {
      return false;
    }
  }

  async function onSearch(e) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const collectionsToQuery =
        collection === "all" ? COLLECTIONS : [collection];
      const fetched = [];
      for (const c of collectionsToQuery) {
        try {
          const items = await fetchCollection(c);
          // attach _collection so we can show where item came from
          const tagged = items.map((it) => ({ ...it, _collection: c }));
          fetched.push(...tagged);
        } catch (err) {
          // ignore single collection error but note it
          console.warn(`Fetch failed for ${c}:`, err?.message ?? err);
        }
      }

      // DEBUG: if searching by height and query looks numeric, dump a few values to console
      try {
        const qNum = Number(String(query).replace(/[^0-9.+-]/g, ""));
        if (String(field).toLowerCase() === "height" && !Number.isNaN(qNum)) {
          console.log(
            "DEBUG: sample heights:",
            fetched.slice(0, 10).map((it) => ({
              id: it.id ?? it._id,
              height: it.height,
              type: typeof it.height,
            }))
          );
        }
      } catch (e) {
        /* ignore debug failure */
      }

      const filtered = fetched.filter((it) =>
        matchItemByField(it, field || "", query)
      );
      setResults(filtered);
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  // reset page when results change
  useEffect(() => {
    setPage(0);
  }, [results]);

  function renderValue(value) {
    if (value === null) return <span>null</span>;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    )
      return <span>{String(value)}</span>;
    return (
      <pre>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return (
    <div>
      <h2 className="text-center text-2xl">Wyszukiwarka</h2>
      <form
        onSubmit={onSearch}
        className="flex gap-2 items-center mb-3 justify-center"
      >
        <label>
          Kolekcja:
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="ml-2 bg-orange-300 p-1 border border-orange-600 rounded"
          >
            <option value="all">Wszystkie</option>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Parametr:
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="ml-2 bg-orange-300 p-1 border border-orange-600 rounded"
          >
            <option>id</option>
            {FIELDS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Wartość:
          <input
            placeholder="szukana wartość"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 bg-orange-300 p-1 border border-orange-600 rounded"
          />
        </label>
        <button
          className="mt-0.5 p-2 border border-orange-700 rounded bg-orange-300 hover:bg-orange-400"
          type="submit"
        >
          Szukaj
        </button>
      </form>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 18 }}>
          <div className="shuriken-spinner" style={{ display: "flex", gap: 8 }}>
            <img
              src={shuriken}
              alt="loading"
              className="shuriken shuriken-1"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
              style={{ width: 40, height: 40 }}
            />
            <img
              src={shuriken}
              alt="loading"
              className="shuriken shuriken-2"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
              style={{ width: 40, height: 40 }}
            />
            <img
              src={shuriken}
              alt="loading"
              className="shuriken shuriken-3"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
              style={{ width: 40, height: 40 }}
            />
          </div>
        </div>
      )}
      {error && <div style={{ color: "crimson" }}>Błąd: {error}</div>}

      <div className="mt-3">
        <div className="flex gap-3 items-center mb-2 justify-center">
          <div>Znaleziono: {results.length}</div>
          <div></div>
        </div>

        <ul>
          {results
            .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
            .map((item, idx) => {
              const key = item.id ?? item._id ?? `${item._collection}-${idx}`;
              const isOpen = expandedId === key;
              return (
                <li key={key} className="mb-3.5 text-[30px]">
                  <div className="flex gap-3 items-center justify-center ">
                    <div className="flex-none items-center justify-center">
                      <img
                        src={item.images?.[0] ?? "/placeholder.svg"}
                        alt={item.name ?? item.title ?? ""}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                        className="max-w-[500px] h-auto rounded-[6px] items-center justify-center ml-[750px]"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">
                        {item.name ?? item.title ?? "(bez nazwy)"}{" "}
                        <small className="ml-2 text-gray-400">
                          {item._collection}
                        </small>
                      </div>
                      <div class="mt-2">
                        <button
                          onClick={() =>
                            setExpandedId((p) => (p === key ? null : key))
                          }
                        >
                          {isOpen ? "Pokaż mniej" : "Pokaż więcej"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-2 p-2.5 bg-[#f8fafc] rounded-[6px]">
                      {Object.entries(item).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: 8 }}>
                          <strong style={{ textTransform: "capitalize" }}>
                            {k}:
                          </strong>
                          <div>{renderValue(v)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
        </ul>

        <div className="flex gap-2 items-center mt-3 justify-center">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            👈🏿
          </button>
          <div>
            Strona {page + 1} /{" "}
            {Math.max(1, Math.ceil(results.length / PAGE_SIZE))}
          </div>
          <button
            onClick={() =>
              setPage((p) =>
                Math.min(
                  p + 1,
                  Math.max(0, Math.ceil(results.length / PAGE_SIZE) - 1)
                )
              )
            }
            disabled={(page + 1) * PAGE_SIZE >= results.length}
          >
            👉🏿
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
