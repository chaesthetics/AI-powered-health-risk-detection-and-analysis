import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HealthRiskDetector from "@/components/HealthRiskDetector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`font-sans items-center justify-items-center min-h-screen`}
    >
      <main className="flex flex-col gap-[32px] items-center">
        <HealthRiskDetector />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center pb-2 text-xs">
        All rights reserved. Built by {"Auriel James Fernandez"}
      </footer>
    </div>
  );
}
