import { GalleryImage } from "@/components/gallery/GalleryImage";
import type { Photo } from "@/components/gallery/types";

export function PhotoTile({
  photo,
  onOpen,
  priority,
  sizes,
}: {
  photo: Photo;
  onOpen: (photo: Photo) => void;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <button
      type="button"
      className="nd-tile"
      aria-label={`View photo: ${photo.name}`}
      onClick={() => onOpen(photo)}
    >
      <GalleryImage
        src={photo.src}
        alt={photo.name}
        className={photo.mono ? "nd-grayscale" : ""}
        priority={priority}
        sizes={sizes}
      />
      <span className="nd-tile-caption">
        <span className="nd-tile-tag">{photo.tag}</span>
        <span className="nd-tile-name">{photo.name}</span>
      </span>
    </button>
  );
}
