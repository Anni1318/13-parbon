import React from 'react';
import { MapPin, Navigation, Navigation2, CheckCircle2, Battery, BatteryMedium, BatteryCharging, BatteryFull, Users, Zap, Search, Layers, Tent, Droplet, ArrowUp, Wifi } from 'lucide-react';

export default function FeatureShowcase() {
  return (
    <section className="bg-[#9f1212] w-full relative z-20">
      <div className="py-16 overflow-hidden">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Everything you need</h2>
          <p className="text-red-100 text-base md:text-lg">Navigate the festival like a local with smart tools.</p>
        </div>

        {/* Scroll Track */}
        <div 
          className="flex overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory gap-8 px-8 py-8 items-center hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          
          <div className="flex gap-8 mx-auto pb-8">
            {/* Screen 1: Pandal Map */}
            <div className="w-[85vw] min-w-[85vw] sm:w-[320px] sm:min-w-[320px] h-[650px] bg-[#e5e5e5] rounded-[2.5rem] shadow-2xl relative overflow-hidden snap-center border-[8px] border-gray-900 flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
              
              {/* Background map placeholder */}
              <div className="absolute inset-0 bg-gray-200">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              
              {/* Top UI */}
              <div className="relative z-10 pt-10 px-4 flex flex-col gap-3">
                <div className="bg-gray-800 text-white text-xs font-medium py-2 px-4 rounded-full self-center shadow-lg flex items-center gap-2">
                  <Navigation size={14} /> Turn your phone - the map turns with you
                </div>
                
                <div className="flex gap-2 overflow-x-hidden pt-2">
                  <div className="bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-bold flex items-center gap-1"><Tent size={16} className="text-orange-500"/> Pandals</div>
                  <div className="bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-bold flex items-center gap-1"><Droplet size={16} className="text-blue-500"/> Toilets</div>
                </div>
              </div>

              {/* Map markers */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/50">
                  <Tent size={24} />
                </div>
              </div>

              {/* Bottom UI dummy */}
              <div className="mt-auto relative z-10 p-4">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <h3 className="font-bold text-lg">College Square</h3>
                  <p className="text-sm text-gray-500">1.2 km away • Very Crowded</p>
                </div>
              </div>
            </div>

            {/* Screen 2: Active Navigation */}
            <div className="w-[85vw] min-w-[85vw] sm:w-[320px] sm:min-w-[320px] h-[650px] bg-[#e5e5e5] rounded-[2.5rem] shadow-2xl relative overflow-hidden snap-center border-[8px] border-gray-900 flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
              
              <div className="absolute inset-0 bg-gray-200">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              
              {/* Fake blue polyline using SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 650">
                <path d="M160,550 L180,450 L140,380 L200,300 L220,180" stroke="#3b82f6" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="220" cy="180" r="10" fill="#ef4444" stroke="white" strokeWidth="4" />
                <circle cx="160" cy="550" r="10" fill="#3b82f6" stroke="white" strokeWidth="4" />
              </svg>

              <div className="relative z-10 pt-12 px-4">
                <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                  <div className="bg-gray-800 p-2 rounded-xl">
                    <ArrowUp size={32} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">200 m</h2>
                    <p className="text-gray-400 text-sm font-medium">Turn right onto MG Road</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen 3: Route Planner */}
            <div className="w-[85vw] min-w-[85vw] sm:w-[320px] sm:min-w-[320px] h-[650px] bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden snap-center border-[8px] border-gray-900 flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
              
              <div className="pt-12 px-4 flex-1">
                <h3 className="font-bold text-xl mb-4">North Kolkata Route</h3>
                
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">5</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Stops</div>
                  </div>
                  <div className="text-center border-l border-r px-4">
                    <div className="text-2xl font-black text-gray-900">4.2</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">KM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">2.5</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Hours</div>
                  </div>
                </div>

                <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-start gap-3 mb-6 border border-red-100">
                  <Zap size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-snug">Optimised to beat peak crowds. Follow the suggested order.</p>
                </div>

                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">{i}</div>
                      <div>
                        <div className="font-bold text-gray-800">Pandal {i}</div>
                        <div className="text-xs text-gray-500">10 mins walk</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <button className="w-full bg-[#9f1212] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 active:scale-95 transition-transform">
                  Start navigation
                </button>
              </div>
            </div>

            {/* Screen 4: Group/Friend Tracker */}
            <div className="w-[85vw] min-w-[85vw] sm:w-[320px] sm:min-w-[320px] h-[650px] bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden snap-center border-[8px] border-gray-900 flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
              
              <div className="pt-12 px-4 border-b pb-4">
                <h3 className="font-bold text-xl text-gray-900">Squad (4)</h3>
                <p className="text-sm text-gray-500">Live sharing active</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
                {[
                  { name: 'Rohan', dist: '50m away', bat: <BatteryFull className="text-green-500" size={18}/> },
                  { name: 'Aditi', dist: '1.2km away', bat: <BatteryMedium className="text-orange-500" size={18}/> },
                  { name: 'Kabir', dist: 'Offline', bat: <Battery className="text-red-500" size={18}/>, offline: true }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {user.name} 
                          {!user.offline && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{user.dist}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 bg-white p-2 rounded-full shadow-sm">
                      {user.bat}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 mt-auto border-t border-gray-200">
                <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl">
                  Invite friend
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
