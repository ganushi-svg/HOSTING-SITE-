import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { Photo } from "@/lib/site";

/**
 * Real site photo with caption. `crop` gives a uniform 4:3 frame for galleries. The image sits in a button so the
 * PhotoLightbox (mounted in the layout) can open it full screen; on hover the caption rises over the picture.
 */
export function SitePhoto({ photo, crop = false, priority = false, sizes = "(min-width: 840px) 50vw, 100vw" }: { photo: Photo; crop?: boolean; priority?: boolean; sizes?: string }) {
  return (
    <figure className={crop ? "site-photo crop" : "site-photo"} data-full={photo.src}>
      <button type="button" className="photo-open" aria-label={`View larger: ${photo.caption}`}>
        <Image src={photo.src} width={photo.w} height={photo.h} alt={photo.alt} sizes={sizes} priority={priority} />
        <span className="photo-veil" aria-hidden="true"><span className="photo-cap">{photo.caption}</span><span className="photo-zoom"><Maximize2 size={16} /></span></span>
      </button>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}
