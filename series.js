import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SeriesPage() {
  const { query } = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/series")
      .then(r => r.json())
      .then(all => setData(all.find(x => x._id === query.id)));
  }, [query.id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h1>{data.title}</h1>

      {data.episodes.map(ep => (
        <div key={ep._id} style={{ marginBottom: 20 }}>
          <h3>Episode {ep.number} - {ep.title}</h3>

          <video controls width="100%">
            <source src={`http://localhost:5000/uploads/${ep.video}`} />
          </video>
        </div>
      ))}
    </div>
  );
}
