import HealthRiskDetector from "@/components/HealthRiskDetector";

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
