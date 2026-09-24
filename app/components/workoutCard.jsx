export default function WorkoutCard({ title, subtitle, tags, duration, calories, rating }) {
  return (
    <div className="bg-[#131416] border border-[#22252a] rounded-3xl overflow-hidden hover:border-amber-500 transition-all duration-300 group cursor-pointer w-full p-4 flex flex-col gap-4">
      
      <div className="w-full h-52 bg-[#1c1e22] rounded-2xl flex items-center justify-center overflow-hidden relative">
        <img 
          src="/carton.jpeg" 
          alt={title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/logo.png";
            e.target.className = "h-8 object-contain opacity-20";
          }}
        />
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-row justify-between items-center w-full gap-2">
              <h3 className="text-white font-black text-base tracking-wide uppercase group-hover:text-amber-500 transition-colors leading-tight truncate flex-1">
                {title}
              </h3>

              <div className="flex flex-row gap-1 shrink-0 flex-nowrap overflow-x-auto scrollbar-none">
                {tags && tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider bg-[#bfff00] text-black whitespace-nowrap shrink-0"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">
            {subtitle || "Barbell, Bench"}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold pt-3 border-t border-[#1c1e22] mt-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[11px] font-black">{duration || 25} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[11px] font-black">{calories || 180} kcal</span>
          </div>

          <div className="flex items-center gap-1 ml-auto text-gray-400 font-black">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.809l-3.97 2.884a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.884a1 1 0 00-1.176 0l-3.97 2.884c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.884c-.777-.557-.378-1.809.582-1.809h4.907a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
            <span className="text-[11px] font-black">{rating || "4.8"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}