import Image from "next/image";
import type { Photo } from "@/lib/site";

/** Real site photo with caption. `crop` gives a uniform 4:3 frame for galleries. */
export function SitePhoto({ photo, crop = false, priority = false, sizes = "(min-width: 840px) 50vw, 100vw" }: { photo: Photo; crop?: boolean; priority?: boolean; sizes?: string }) {
  return (
    <figure className={crop ? "site-photo crop" : "site-photo"}>
      <Image src={photo.src} width={photo.w} height={photo.h} alt={photo.alt} sizes={sizes} priority={priority} />
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}
