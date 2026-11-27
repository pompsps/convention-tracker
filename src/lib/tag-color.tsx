// src/lib/tag-color.ts
export function tagColor(tag: string) {
  let hash = 0;
  for (const ch of tag.toLowerCase())
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = hash % 360;

  return {
    bg: `hsl(${hue} 70% 88%)`, // light pastel background
    text: `hsl(${hue} 60% 25%)`, // dark text in the same hue, so it stays readable
  };
}
