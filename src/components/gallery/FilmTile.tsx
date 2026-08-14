import { Play } from "lucide-react";
import { GalleryImage } from "@/components/gallery/GalleryImage";
import type { Film } from "@/components/gallery/types";

export function FilmTile({ film, onPlay }: { film: Film; onPlay: (film: Film) => void }) {
  return (
    <button
      type="button"
      className="nd-tile"
      aria-label={`Play film: ${film.name}`}
      onClick={() => onPlay(film)}
    >
      {film.poster ? (
        <GalleryImage src={film.poster} alt={film.name} />
      ) : (
        <video src={film.src} muted playsInline preload="metadata" aria-hidden="true" />
      )}
      <span className="nd-play-btn" aria-hidden="true">
        <Play size={20} fill="currentColor" />
      </span>
      <span className="nd-tile-caption">
        <span className="nd-tile-tag">Film</span>
        <span className="nd-tile-name">{film.name}</span>
      </span>
    </button>
  );
}
