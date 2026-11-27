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
    <div className="flex h-full lg:h-screen min-h-0 flex-col gap-5 lg:w-screen lg:px-auto lg:p-5 transition-width delay-300">
      <div className="flex w-full place-items-center gap-2">
        <span className={`text-3xl ${cherryBomb}`}>TallyUp</span>
      </div>
      <div className="bg-(--accent) flex min-h-0 h-full lg:w-full lg:h-screen flex-col rounded-lg p-2 text-(--text-main) relative">
        <div className="absolute -top-6 right-0 bg-(--accent) flex w-40 px-5 rounded-t-xl justify-center">
          <span className="text-2xl text-(--accent-secondary)">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
