import type { ReactNode } from "react";
import { Cherry_Bomb_One } from "next/font/google";

const cherryBomb = Cherry_Bomb_One({
  weight: "400",
  subsets: ["latin"],
});
export default function PageContainer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex w-full place-items-center gap-2">
        <span className={`text-3xl ${cherryBomb}`}>TallyUp</span> -
        <div className="shrink-0">
          <span className="text-(--accent-secondary) size-10">{title}</span>
        </div>
      </div>
      <div className="bg-(--accent) flex min-h-0 h-full flex-col rounded-lg p-5 text-(--text-main)">
        {children}
      </div>
    </div>
  );
}
