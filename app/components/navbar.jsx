'use client';
import Link from 'next/link';
import { useWorkout } from '@/app/layout';

export default function Navbar() {
  const { plan, saved } = useWorkout() || { plan: [], saved: [] };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#080808] border-b border-[#141414] z-[100]">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 shrink-0 pl-0 cursor-pointer">
          <img 
            src="/logo.png" 
            alt="FITLOG" 
            className="h-6 object-contain"
          />
          <span className="text-white font-black text-lg tracking-wider uppercase">FITLOG</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
            Workouts
          </Link>
          <Link href="/my-plan" className="bg-[#5d7a00] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-opacity hover:opacity-90 cursor-pointer">
            My Plan
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider shrink-0">
          <Link href="/my-plan" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <span>Plan</span>
            <span className="bg-[#bfff00] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
              {plan.length}
            </span>
          </Link>
          
          <Link href="/my-plan" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <span>Saved</span>
            <span className="bg-[#1c242b] border border-[#2d3a45] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
              {saved.length}
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
}