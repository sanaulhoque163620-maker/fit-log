'use client';
import { useWorkout } from "@/app/layout";
import Link from "next/link";
import { useState } from "react";

export default function MyPlanPage() {
  const { plan, setPlan, saved, setSaved } = useWorkout() || { plan: [], setPlan: () => {}, saved: [] };
  const [activeTab, setActiveTab] = useState("today");
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentList = activeTab === "today" ? plan : saved;

  const filteredList = currentList.filter(w => {
    const name = (w.name || w.title || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const tags = (w.muscleGroups || w.tags || []).some(t => t.toLowerCase().includes(query));
    return name.includes(query) || tags;
  });

  const displayCount = filteredList.length;
  const displayMinutes = filteredList.reduce((sum, item) => sum + (item.duration || 0), 0);
  const displayCalories = filteredList.reduce((sum, item) => sum + (item.caloriesBurned || item.calories || 0), 0);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => { setToastMessage(""); }, 3000);
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    if (activeTab === "today") {
      setPlan(plan.filter(item => item.id !== id));
      showToast("Removed from today's plan");
    } else {
      setSaved(saved.filter(item => item.id !== id));
      showToast("Removed from saved lifts");
    }
  };

  const handleMarkAsDone = (id, e) => {
    e.stopPropagation();
    if (completedWorkouts.includes(id)) {
      setCompletedWorkouts(completedWorkouts.filter(itemId => itemId !== id));
    } else {
      setCompletedWorkouts([...completedWorkouts, id]);
    }
  };

  const getTagStyle = (tag) => {
    const lowerTag = tag ? tag.toLowerCase() : '';
    if (lowerTag === 'chest' || lowerTag === 'arms') return 'bg-[#3b441f] text-[#d4f952]';
    if (lowerTag === 'back') return 'bg-[#44381f] text-[#f9d452]';
    if (lowerTag === 'shoulders') return 'bg-[#441f1f] text-[#f95252]';
    if (lowerTag === 'legs' || lowerTag === 'core') return 'bg-[#273b44] text-[#52d4f9]';
    return 'bg-[#222222] text-gray-400';
  };
  return (
    <main className="min-h-screen bg-[#000000] text-white pt-32 px-6 md:px-12 lg:px-20 pb-16 relative">
      
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-[#131416] border border-[#22252a] text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm transition-all duration-300">
          <div className="w-5 h-5 rounded-full bg-[#f95252] flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <span className="text-xs font-black uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xs">
            <h2 className="text-xl font-black uppercase tracking-wide mb-1">
              {activeTab === "today" ? "My Plan" : "My Saved Lifts"}
            </h2>
            <p className="text-gray-400 text-[11px] font-light leading-relaxed">
              Cup of five lifts for today. Finish them, then load more.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4 w-full md:max-w-xl bg-[#131416] border border-[#22252a] rounded-xl p-4">
            <div className="flex flex-col items-center justify-center border-r border-[#22252a]">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Exercises</span>
              <span className="text-[#bfff00] font-black text-2xl leading-none">{displayCount}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-[#22252a]">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Minutes</span>
              <span className="text-white font-black text-2xl leading-none">{displayMinutes}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Calories</span>
              <span className="text-white font-black text-2xl leading-none">{displayCalories}</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1c1e22] pb-3 gap-4">
            <div className="bg-[#131416] border border-[#22252a] p-1 rounded-full flex gap-1">
              <button onClick={() => { setActiveTab("today"); setSearchQuery(""); }} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === "today" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
                Today's Plan
              </button>
              <button onClick={() => { setActiveTab("saved"); setSearchQuery(""); }} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === "saved" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
                Saved
              </button>
            </div>

            <div className="w-full sm:w-64 relative">
              <input 
                type="text" 
                placeholder="Search plan entries..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131416] border border-[#22252a] rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors uppercase font-bold tracking-wide"
              />
            </div>
            
            <div className="bg-[#131416] border border-[#22252a] text-xs px-3 py-1.5 rounded text-gray-400 font-medium">
              Sort By: Duration ▾
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="w-full bg-[#131416] border border-[#22252a] rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[260px] gap-5">
              <div>
                <h3 className="text-white font-black text-xl tracking-wide uppercase mb-1">NO MATCHING LIFTS</h3>
                <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed font-medium">
                  No workouts found matching your query. Clear the search bar or add more from the library.
                </p>
              </div>
              <Link href="/" className="bg-amber-500 text-black font-extrabold uppercase px-6 py-2.5 rounded-full text-xs tracking-widest hover:bg-amber-400 transition-colors">Go to workouts</Link>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {filteredList.map((workout) => {
                const displayTags = workout.muscleGroups || workout.tags || [];
                const isCompleted = completedWorkouts.includes(workout.id);

                return (
                  <div key={workout.id} onClick={() => setSelectedWorkout(workout)} className="bg-[#131416] border border-[#22252a] rounded-2xl overflow-hidden hover:border-amber-500 transition-all duration-300 group cursor-pointer w-full flex flex-row h-[120px] p-4 gap-4 items-center">
                    <div className="w-20 h-full bg-[#1c1e22] rounded-xl flex items-center justify-center overflow-hidden shrink-0 relative">
                      <img src="/carton.jpeg" alt={workout.name || workout.title} className="w-full h-full object-cover opacity-90" />
                    </div>

                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <h3 className="text-white font-black text-base tracking-wide uppercase truncate leading-none mb-1">{workout.name || workout.title}</h3>
                      <p className="text-gray-500 text-[11px] font-bold uppercase mb-2 truncate">{workout.subtitle || "Bodyweight"}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 font-black leading-none">
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          <span>{workout.duration || 0} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          <span>{(workout.caloriesBurned || workout.calories || 0)} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-3 shrink-0 ml-auto pl-2 pr-4">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedWorkout(workout); }} className="bg-[#1c1e22] border border-[#22252a] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#25282e] transition-colors">View Details</button>
                      {activeTab === "today" && (
                        <button onClick={(e) => handleMarkAsDone(workout.id, e)} className={`border text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${isCompleted ? "bg-[#5d7a00] border-[#5d7a00] text-white" : "bg-[#bfff00] border-[#bfff00] text-black hover:opacity-90"}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                          {isCompleted ? "Done ✓" : "Mark as Done"}
                        </button>
                      )}
                      <button onClick={(e) => handleRemove(workout.id, e)} className="text-gray-500 hover:text-red-500 text-sm p-2 transition-colors font-bold">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {selectedWorkout && (
        <div className="fixed inset-x-0 bottom-0 top-20 bg-[#000000] z-40 overflow-y-auto px-6 md:px-12 lg:px-20 pb-16 flex flex-col items-center">
          <div className="max-w-7xl w-full flex items-center justify-between pb-4 border-b border-[#141414] mb-6 mt-6">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Details View</span>
            <button onClick={() => setSelectedWorkout(null)} className="bg-[#131416] border border-[#22252a] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-[#1c1e22]">Back To Plan</button>
          </div>

          <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 h-auto lg:h-[520px] items-stretch">
            <div className="w-full lg:w-[480px] bg-[#131416] rounded-3xl border border-[#22252a] overflow-hidden shrink-0 relative h-[400px] lg:h-full">
              <img src="/carton.jpeg" alt={selectedWorkout.name || selectedWorkout.title} className="w-full h-full object-cover opacity-90" />
            </div>

            <div className="flex-1 w-full flex flex-col justify-between overflow-y-auto lg:pr-2 gap-6 h-full">
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-2">{selectedWorkout.name || selectedWorkout.title}</h1>
                  <p className="text-gray-400 text-xs font-light leading-relaxed max-w-xl">{selectedWorkout.desc || selectedWorkout.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selectedWorkout.muscleGroups || selectedWorkout.tags || []).map((tag, idx) => (
                    <span key={idx} className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${getTagStyle(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border border-[#22252a] rounded-2xl overflow-hidden bg-[#131416] w-full max-w-xl text-xs">
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a] bg-[#0c0c0c]"><span className="text-gray-500 font-bold uppercase tracking-wider">SETS</span><span className="text-white font-black">{selectedWorkout.sets || 3}</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a]"><span className="text-gray-500 font-bold uppercase tracking-wider">REPS</span><span className="text-white font-black">{selectedWorkout.reps || "30-45s"}</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a] bg-[#0c0c0c]"><span className="text-gray-500 font-bold uppercase tracking-wider">DURATION</span><span className="text-white font-black">{selectedWorkout.duration || 10} min</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a]"><span className="text-gray-500 font-bold uppercase tracking-wider">CALORIES</span><span className="text-white font-black">{(selectedWorkout.caloriesBurned || selectedWorkout.calories || 60)} kcal</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a] bg-[#0c0c0c]"><span className="text-gray-500 font-bold uppercase tracking-wider">EQUIPMENT</span><span className="text-white font-black uppercase">{selectedWorkout.subtitle || "Bodyweight"}</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a]"><span className="text-gray-500 font-bold uppercase tracking-wider">DIFFICULTY</span><span className="text-white font-black uppercase">{selectedWorkout.difficulty || "Beginner"}</span></div>
                  <div className="flex justify-between items-center p-3 bg-[#0c0c0c]"><span className="text-gray-500 font-bold uppercase tracking-wider">RATING</span><span className="text-white font-black">{selectedWorkout.rating || "4.4"}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}