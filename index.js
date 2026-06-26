import { useEffect, useState } from "react";

export default function Home() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/series")
      .then(r => r.json())
      .then(setSeries);
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h1>🎬 Streaming App</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {series.map(s => (
          <a key={s._id} href={`/series/${s._id}`}>
            <div style={{ background: "#222", padding: 10 }}>
              <img src={s.poster} style={{ width: "100%" }} />
              <h3>{s.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
