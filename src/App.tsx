import { useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchWeather(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setWeather(null);
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${key}&units=metric`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error(
          `${response.status} ${response.statusText.toLowerCase()}`,
        );
      setWeather(await response.json());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "network exception",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="weather-shell">
      <header className="masthead">
        <span>WX/02</span>
        <span>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </header>
      <section className="search-zone">
        <div className="search-frame">
          <form onSubmit={searchWeather}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="•••"
              autoComplete="off"
            />
            <button type="submit" disabled={loading} aria-label="run query">
              {loading ? "..." : "↗"}
            </button>
          </form>
        </div>
        <div className="coordinates">
          {query ? `${query.length}.0 / 0.0` : "00.0000, 00.0000"}
        </div>
      </section>
      {error && <div className="error-console">{error}</div>}
      <section className="result-shelf">
        {weather && (
          <>
            <div className="location">
              <span>{weather.sys.country}</span>
              <strong>{weather.name}</strong>
            </div>
            <div className="temperature">{Math.round(weather.main.temp)}°</div>
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
            />
            <div className="details">
              <span>{weather.weather[0].description}</span>
              <span>feels {Math.round(weather.main.feels_like)}°</span>
              <span>humidity {weather.main.humidity}%</span>
              <span>pressure {weather.main.pressure}</span>
              <span>wind {weather.wind.speed} m/s</span>
            </div>
          </>
        )}
      </section>
      <footer className="status-line">
        {weather ? "200 / OK" : "idle / 2.5"}
      </footer>
    </main>
  );
}

export default App;
