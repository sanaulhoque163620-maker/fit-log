'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Link from 'next/link';
import './globals.css';

const WorkoutContext = createContext();

export function useWorkout() {
  return useContext(WorkoutContext);
}

export default function RootLayout({ children }) {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const localPlan = localStorage.getItem('fitlog_plan');
    const localSaved = localStorage.getItem('fitlog_saved');
    if (localPlan) setPlan(JSON.parse(localPlan));
    if (localSaved) setSaved(JSON.parse(localSaved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fitlog_plan', JSON.stringify(plan));
    }
  }, [plan, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fitlog_saved', JSON.stringify(saved));
    }
  }, [saved, isLoaded]);

  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <WorkoutContext.Provider value={{ plan, setPlan, saved, setSaved }}>
          <Navbar />
          <div className="pb-24">
            {children}
          </div>
          <footer className="fixed bottom-0 left-0 w-full bg-[#080808] border-t border-[#141414] z-50 h-20">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 h-full flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 shrink-0 pl-0 cursor-pointer">
                <img src="/logo.png" alt="FITLOG" className="h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="text-white font-black text-sm tracking-wider uppercase">FITLOG</span>
              </Link>
              <div className="text-gray-500 text-[11px] font-medium tracking-wide">
                © 2026 FitLog — Workout Library. Train hard, log honest.
              </div>
            </div>
          </footer>
        </WorkoutContext.Provider>
      </body>
    </html>
  );
}