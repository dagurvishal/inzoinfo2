"use client";

export default function MovieCard({ movie, onOpen }) {
  return (
    <div
      className="card"
      style={{ padding: 10, cursor: "pointer" }}
      onClick={onOpen}
    >
      <img className="poster" src={movie.poster_url} alt={movie.name} />
      <div className="movieTitle">{movie.name}</div>
      <div className="movieMeta">{movie.category}</div>
    </div>
  );
}
