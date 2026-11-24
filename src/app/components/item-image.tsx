"use client";

import { useEffect, useRef } from "react";

export default function ItemImage({ blob, alt }: { blob?: Blob; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!blob || !img) return;
    const url = URL.createObjectURL(blob);
    img.src = url; // updates the DOM directly, which is what effects are for
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  if (!blob) return <div className="h-full w-full bg-neutral-100" />;
  return (
    <img
      ref={imgRef}
      alt={alt}
      className="size-35 object-cover p-2 rounded-xl"
    />
  );
}

{
  /*
  first version
  // src/components/item-image.tsx
"use client";
import { useEffect, useState } from "react";

export default function ItemImage({ blob, alt }: { blob?: Blob; alt: string }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!blob) return;
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u); // avoid memory leaks
  }, [blob]);

  if (!url) return <div className="h-full w-full bg-neutral-100" />;
  return <img src={url} alt={alt} className=" p-2 m-0 object-cover size-30" />;
}

  */
}
