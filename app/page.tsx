import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 p-6">
      <main className="max-w-3xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Stop Overpaying for AI Tools
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Discover exactly how much your team spends on AI and uncover hidden savings in minutes. The ultimate audit for modern engineering teams.
        </p>

        <div className="pt-8">
          <Link href="/audit">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 bg-white text-black hover:bg-zinc-200">
              Audit my AI spend &rarr;
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm font-medium">
        Powered by <span className="text-zinc-400">Credex</span> — Discounted AI Credits
      </footer>
    </div>
  );
}
