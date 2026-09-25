'use client';
import { useState, useEffect } from "react";
import WorkoutCard from "./components/workoutCard.jsx";
import { useWorkout } from "./layout.js";

export default function Home() {
  const { plan, setPlan, saved, setSaved } = useWorkout() || { plan: [], setPlan: () => {}, saved: [] };
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [sortBy, setSortBy] = useState("Duration");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/workouts.json')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => console.error("Error:", err));
  }, []);

  const showToast = (message, type = "success") => {
    setToastType(type);
    setToastMessage(message);
    setTimeout(() => { setToastMessage(""); }, 3000);
  };

  const handleAddToPlan = (workout) => {
    if (!workout) return;
    if (plan.some(item => String(item.id) === String(workout.id))) {
      showToast("Already in your plan", "error");
      return;
    }
    if (plan.length >= 5) {
      showToast("Plan is full! Maximum 5 lifts allowed", "error");
      return;
    }
    setPlan([...plan, workout]);
    showToast("Added to today's plan", "success");
  };

  const handleSaveForLater = (workout) => {
    if (!workout) return;
    if (saved.some(item => String(item.id) === String(workout.id))) {
      showToast("Already saved for later", "error");
    } else {
      setSaved([...saved, workout]);
      showToast("Saved for later", "success");
    }
  };
  const filteredWorkouts = workouts.filter(w => {
    const name = (w.name || w.title || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const tags = (w.muscleGroups || w.tags || []).some(t => t.toLowerCase().includes(query));
    return name.includes(query) || tags;
  });

  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    if (sortBy === "Duration") return (b.duration || 0) - (a.duration || 0);
    if (sortBy === "Calories") return (b.caloriesBurned || b.calories || 0) - (a.caloriesBurned || a.calories || 0);
    if (sortBy === "Rating") return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
    return 0;
  });

  const getTagStyle = (tag) => {
    const lowerTag = tag ? tag.toLowerCase() : '';
    if (lowerTag === 'chest' || lowerTag === 'arms') return 'bg-[#3b441f] text-[#d4f952]';
    if (lowerTag === 'back') return 'bg-[#44381f] text-[#f9d452]';
    if (lowerTag === 'shoulders') return 'bg-[#441f1f] text-[#f95252]';
    if (lowerTag === 'legs' || lowerTag === 'core') return 'bg-[#273b44] text-[#52d4f9]';
    return 'bg-[#222222] text-gray-400';
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white pt-28 px-6 md:px-12 lg:px-20 pb-16 relative">
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-[#131416] border border-[#22252a] text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm">
          {toastType === "success" ? (
            <div className="w-5 h-5 rounded-full bg-[#bfff00] flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#f95252] flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
          )}
          <span className="text-xs font-black uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-20 bg-[#1e1e1e] border border-[#2d2d2d] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex-1 text-left">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-[11px]">Workout Library</span>
          <h1 className="text-4xl font-black tracking-tight mt-3 mb-4 uppercase leading-none text-white">Train with intent.<br />Log every set.</h1>
          <p className="text-gray-400 text-sm max-w-lg mb-8">FitLog is a dark gym companion: pick a lift, lock it into today's plan.</p>
          <button className="bg-amber-500 text-black font-extrabold uppercase px-6 py-3 rounded text-xs tracking-widest">Browse Workouts</button>
        </div>
        <div className="w-full md:w-[400px] h-[240px] relative overflow-hidden flex items-center justify-center shrink-0">
          <img src="/banner.png" alt="Fitlog Banner" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="border-b border-[#222222] pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-1">
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">The Library</h2>
              <p className="text-gray-500 text-xs mt-1">See various lifts covering every major muscle group</p>
            </div>
            <div className="w-full sm:w-72 relative">
              <input type="text" placeholder="Search by name or tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#131416] border border-[#22252a] rounded-full px-5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 uppercase font-bold tracking-wide" />
            </div>
          </div>
          <div className="relative shrink-0 z-50">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-[#141414] border border-[#222222] text-xs px-4 py-2.5 rounded-full text-gray-400 font-bold tracking-wider uppercase flex items-center gap-2">Sort By: {sortBy} <span className="text-[10px]">▼</span></button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#131416] border border-[#22252a] rounded-xl shadow-2xl z-50 overflow-hidden p-1 flex flex-col">
                {["Duration", "Calories", "Rating"].map((option) => (
                  <button key={option} onClick={() => { setSortBy(option); setIsDropdownOpen(false); }} className={`text-left text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-lg ${sortBy === option ? "bg-white text-black" : "text-gray-400 hover:bg-[#1c1e22]"}`}>{option}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {sortedWorkouts.map((workout) => (
            <div key={workout.id} onClick={() => setSelectedWorkout(workout)}>
              <WorkoutCard 
                title={workout.name || workout.title} 
                subtitle={workout.equipment || workout.subtitle} 
                tags={workout.muscleGroups || workout.tags || []} 
                duration={workout.duration} 
                calories={workout.caloriesBurned || workout.calories} 
                rating={workout.rating} 
                image={workout.image}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedWorkout && (
        <div className="fixed inset-x-0 bottom-0 top-20 bg-[#000000] z-40 overflow-y-auto px-6 md:px-12 lg:px-20 pb-16 flex flex-col items-center">
          <div className="max-w-7xl w-full flex items-center justify-between pb-4 border-b border-[#141414] mb-6 mt-6">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Details View</span>
            <button onClick={() => setSelectedWorkout(null)} className="bg-[#131416] border border-[#22252a] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl">Back To Library</button>
          </div>

          <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="w-full lg:w-[480px] bg-[#131416] rounded-3xl border border-[#22252a] overflow-hidden shrink-0 relative h-[400px] lg:h-auto">
              <img src={selectedWorkout.image} alt={selectedWorkout.name} className="w-full h-full object-cover opacity-90" />
            </div>

            <div className="flex-1 w-full flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-2">{selectedWorkout.name || selectedWorkout.title}</h1>
                  <p className="text-gray-400 text-xs font-light leading-relaxed max-w-xl">{selectedWorkout.desc || selectedWorkout.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedWorkout.muscleGroups || selectedWorkout.tags || []).map((tag, idx) => (
                    <span key={idx} className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${getTagStyle(tag)}`}>{tag}</span>
                  ))}
                </div>
                <div className="border border-[#22252a] rounded-2xl overflow-hidden bg-[#131416] w-full max-w-xl text-xs">
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a] bg-[#0c0c0c]"><span className="text-gray-500 font-bold">SETS</span><span className="text-white font-black">{selectedWorkout.sets || 3}</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a]"><span className="text-gray-500 font-bold">REPS</span><span className="text-white font-black">{selectedWorkout.reps || "30-45s"}</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a] bg-[#0c0c0c]"><span className="text-gray-500 font-bold">DURATION</span><span className="text-white font-black">{selectedWorkout.duration || 10} min</span></div>
                  <div className="flex justify-between items-center p-3 border-b border-[#22252a]"><span className="text-gray-500 font-bold">CALORIES</span><span className="text-white font-black">{(selectedWorkout.caloriesBurned || selectedWorkout.calories || 60)} kcal</span></div>
                  <div className="flex justify-between items-center p-3 bg-[#0c0c0c]"><span className="text-gray-500 font-bold">RATING</span><span className="text-white font-black">{selectedWorkout.rating || "4.4"}</span></div>
                </div>
              </div>

              <div className="flex flex-row gap-3 w-full max-w-xl mt-auto pt-4">
                <button onClick={() => handleAddToPlan(selectedWorkout)} className="flex-1 font-black bg-[#bfff00] text-black uppercase py-3 rounded-xl text-xs flex items-center justify-center gap-2">Add to today's plan</button>
                <button onClick={() => handleSaveForLater(selectedWorkout)} className="flex-1 bg-[#131416] border border-[#22252a] text-white font-black uppercase py-3 rounded-xl text-xs flex items-center justify-center gap-2">Save for later</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}