'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import type { Pandal } from '@/lib/types';
import { Navigation, Loader2, Star, ShieldAlert, MapPin, X, Search, ChevronDown, Activity, Info, Phone } from 'lucide-react';

const RoutingMachine = dynamic(() => import('./RoutingMachine'), { ssr: false });

// Fix default leaflet markers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const goldIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 36'%3E%3Cellipse cx='12' cy='34' rx='6' ry='2' fill='%23000' opacity='0.2'/%3E%3Cpath d='M12 0C7.03 0 3 4.03 3 9c0 7 9 27 9 27s9-20 9-27c0-4.97-4.03-9-9-9z' fill='%23F59E0B'/%3E%3Ccircle cx='12' cy='9' r='4' fill='%23fff' opacity='0.8'/%3E%3C/svg%3E",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center w-5 h-5"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full shadow-md"></div></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom Icons for Amenities
const createAmenityIcon = (emoji: string, bgColor: string) => L.divIcon({
  html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 3px 6px rgba(0,0,0,0.4); border: 2px solid white;">${emoji}</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const toiletIcon = createAmenityIcon('🚻', '#3B82F6');
const policeIcon = createAmenityIcon('🚓', '#1D4ED8');
const hospitalIcon = createAmenityIcon('🏥', '#EF4444');

function LocationSetter({
  onLocation,
}: {
  onLocation: (latlng: L.LatLng) => void;
}) {
  const map = useMapEvents({
    locationfound(e) {
      onLocation(e.latlng);
    },
    locationerror(e) {
      console.warn("Location error:", e.message, "- Using fallback location.");
      const fallbackLatLng = L.latLng(22.5726, 88.3639);
      onLocation(fallbackLatLng);
      map.setView(fallbackLatLng, 14);
    }
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
  }, [map]);

  return null;
}

function MapController({
  onMapReady,
  onBoundsChange,
  active,
}: {
  onMapReady: (map: L.Map) => void;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  active: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);

  useMapEvents({
    moveend() {
      if (active) {
        onBoundsChange(map.getBounds());
      }
    },
  });

  useEffect(() => {
    if (active && map) {
      onBoundsChange(map.getBounds());
    }
  }, [active, map, onBoundsChange]);

  return null;
}

export default function Map() {
  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    setMapInstance(map);
  }, []);

  // Itinerary Routing State
  const [itineraryStops, setItineraryStops] = useState<any[]>([]);
  const [showItineraryRoute, setShowItineraryRoute] = useState(false);
  const [routeStats, setRouteStats] = useState<{distance: number, time: number} | null>(null);

  // Load itinerary from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tour_itinerary');
    if (saved) {
      try {
        const stops = JSON.parse(saved);
        if (stops && stops.length > 0) {
          setItineraryStops(stops);
          setShowItineraryRoute(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Filter States (Chips)
  const [showPandals, setShowPandals] = useState(true);
  const [showToilets, setShowToilets] = useState(false);
  const [showPolice, setShowPolice] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  
  // Bottom Sheet State
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [nearest, setNearest] = useState<{hospital: any, police: any, toilets: any}>({ hospital: null, police: null, toilets: null });

  useEffect(() => {
    fetch('/api/pandals')
      .then((r) => r.json())
      .then((data) => {
        setPandals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calculate nearest when sheet is open
  useEffect(() => {
    if (!bottomSheetOpen || !userLocation || amenities.length === 0) return;

    let minH = Infinity, minP = Infinity, minT = Infinity;
    let nH = null, nP = null, nT = null;

    amenities.forEach(a => {
      const aLat = Number(a.lat);
      const aLon = Number(a.lon);
      if (isNaN(aLat) || isNaN(aLon)) return;
      const d = L.latLng(userLocation.lat, userLocation.lng).distanceTo(L.latLng(aLat, aLon));
      const amType = a.tags?.amenity;
      if (amType === 'hospital' && d < minH) { minH = d; nH = a; }
      if (amType === 'police' && d < minP) { minP = d; nP = a; }
      if (amType === 'toilets' && d < minT) { minT = d; nT = a; }
    });

    setNearest({ hospital: nH, police: nP, toilets: nT });
  }, [amenities, userLocation, bottomSheetOpen]);

  const handleLocate = () => {
    const m = mapInstance || mapRef.current;
    if (m) {
      m.locate({ setView: true, maxZoom: 14 });
    }
  };

  const fetchAmenities = useCallback(async (bounds?: L.LatLngBounds) => {
    if (!showToilets && !showPolice && !showHospitals) {
      setAmenities([]);
      return;
    }

    setLoadingAmenities(true);
    let bbox = '22.45,88.25,22.65,88.45';
    const activeBounds = bounds || (mapInstance ? mapInstance.getBounds() : (mapRef.current ? mapRef.current.getBounds() : null));
    if (activeBounds) {
      bbox = `${activeBounds.getSouth()},${activeBounds.getWest()},${activeBounds.getNorth()},${activeBounds.getEast()}`;
    }

    try {
      const url = `/api/amenities?bbox=${bbox}&toilets=${showToilets}&police=${showPolice}&hospitals=${showHospitals}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAmenities(data);
      }
    } catch (e) {
      console.error("Failed to fetch amenities", e);
    } finally {
      setLoadingAmenities(false);
    }
  }, [showToilets, showPolice, showHospitals, mapInstance]);

  // Immediately fetch or clear amenities when toggles change
  useEffect(() => {
    if (showToilets || showPolice || showHospitals) {
      fetchAmenities();
    } else {
      setAmenities([]);
    }
  }, [showToilets, showPolice, showHospitals, fetchAmenities]);

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-100 overflow-hidden">
      
      {/* 
        ==================================================
        TOP OVERLAY: Chips
        ==================================================
      */}
      <div className="absolute top-16 md:top-20 left-0 right-0 z-[1000] px-4 py-2 pointer-events-none flex flex-col gap-3">
        {/* Horizontal Chips */}
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setShowPandals(!showPandals)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all text-sm font-bold ${
              showPandals 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🪔</span> Pandals {pandals.length > 0 ? `(${pandals.length})` : ''}
          </button>
          
          {/* Divider */}
          <div className="shrink-0 w-px h-6 bg-gray-300 mx-1" />
          <span className="shrink-0 text-xs font-bold text-gray-500 uppercase px-1">Public Amenities</span>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all text-sm font-bold ${
              showHospitals 
                ? 'bg-red-50 border-red-300 text-red-900' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🏥</span> Hospitals
          </button>

          <button
            onClick={() => setShowPolice(!showPolice)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all text-sm font-bold ${
              showPolice 
                ? 'bg-blue-50 border-blue-300 text-blue-900' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🚓</span> Police Stations
          </button>

          <button
            onClick={() => setShowToilets(!showToilets)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all text-sm font-bold ${
              showToilets 
                ? 'bg-sky-50 border-sky-300 text-sky-900' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🚻</span> Public Toilets
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <Loader2 size={32} className="text-amber-500 animate-spin" />
        </div>
      )}

      {/* 
        ==================================================
        MAP LAYER
        ==================================================
      */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer
          center={[22.5726, 88.3639]}
          zoom={12}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSetter onLocation={setUserLocation} />
          
          <MapController 
            onMapReady={handleMapReady}
            onBoundsChange={fetchAmenities} 
            active={showToilets || showPolice || showHospitals} 
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup className="google-popup">
                <div className="p-1 font-sans text-sm font-bold text-gray-900">
                  You are here
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pandal Markers */}
          {showPandals && pandals.map((p) => (
            <Marker key={p.id} position={[p.latitude, p.longitude]} icon={p.isFeatured ? goldIcon : icon}>
              <Popup className="google-popup">
                <div className="min-w-[180px] p-1 font-sans">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-gray-900 text-base m-0 leading-tight">{p.name}</h3>
                    {p.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500 shrink-0 ml-2" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-snug">
                    {p.area} • {p.zone}
                  </p>
                  <button
                    onClick={() => {
                      setDestination([p.latitude, p.longitude]);
                      setBottomSheetOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-bold rounded-full transition-colors shadow-sm"
                  >
                    <Navigation size={14} className="rotate-45" /> Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Amenity Markers */}
          {amenities.map((amenity) => {
            let amIcon: any = icon;
            let title = "Amenity";
            let color = "bg-[#1a73e8]";
            
            const amType = amenity.tags?.amenity;
            if (amType === 'toilets' && showToilets) {
              amIcon = toiletIcon; title = "Public Toilet"; color = "bg-sky-600";
            } else if (amType === 'police' && showPolice) {
              amIcon = policeIcon; title = "Police Station"; color = "bg-blue-700";
            } else if (amType === 'hospital' && showHospitals) {
              amIcon = hospitalIcon; title = "Hospital"; color = "bg-red-600";
            } else {
              return null; // Skip if filter was turned off
            }

            const name = amenity.tags?.name || title;
            const lat = Number(amenity.lat);
            const lon = Number(amenity.lon);
            if (isNaN(lat) || isNaN(lon)) return null;

            return (
              <Marker key={`amenity-${amType}-${amenity.id}`} position={[lat, lon]} icon={amIcon}>
                <Popup className="google-popup">
                  <div className="min-w-[180px] p-1 font-sans">
                    <h3 className="font-bold text-gray-900 text-[15px] m-0 leading-tight mb-1">{name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-3">{title}</p>
                    <button
                      onClick={() => {
                        setDestination([lat, lon]);
                        setBottomSheetOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 ${color} text-white text-sm font-bold rounded-full transition-colors shadow-sm`}
                    >
                      <Navigation size={14} className="rotate-45" /> Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Active Route */}
          {!showItineraryRoute && userLocation && destination && (
            <RoutingMachine
              from={[userLocation.lat, userLocation.lng]}
              to={destination}
            />
          )}

          {/* Smart Itinerary */}
          {showItineraryRoute && itineraryStops.length > 0 && (
            <RoutingMachine
              waypoints={[
                ...(userLocation ? [[userLocation.lat, userLocation.lng] as [number, number]] : []),
                ...itineraryStops.map((s) => [s.pandal.latitude, s.pandal.longitude] as [number, number])
              ]}
              onRouteCalculated={(dist, time) => setRouteStats({ distance: dist, time: time })}
            />
          )}
        </MapContainer>
      </div>

      {/* 
        ==================================================
        BOTTOM SEARCH BAR
        ==================================================
      */}
      <div className="absolute bottom-6 md:bottom-8 left-4 right-20 md:right-24 z-[1000] pointer-events-none pb-safe">
        <div className="pointer-events-auto bg-white rounded-full shadow-lg flex items-center px-4 py-3 border border-gray-200">
          <Search size={20} className="text-gray-500 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search pandals or places..." 
            className="w-full bg-transparent outline-none text-gray-800 text-[15px] font-medium placeholder-gray-400"
          />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 ml-2">
            <span className="text-gray-600 font-bold text-sm">G</span>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Right side) */}
      <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-[1000] flex flex-col gap-3 pb-safe">
        {loadingAmenities && (
          <div className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center border border-gray-200">
            <Loader2 size={24} className="text-blue-500 animate-spin" />
          </div>
        )}
        <button
          onClick={handleLocate}
          className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 text-gray-700 transition-colors"
        >
          <Navigation size={24} className="fill-gray-700" />
        </button>
        <button
          onClick={() => {
            setShowToilets(true);
            setShowPolice(true);
            setShowHospitals(true);
            setBottomSheetOpen(true);
            if (!userLocation) handleLocate();
          }}
          className="bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg border border-red-700 text-white transition-colors flex items-center justify-center relative"
        >
          <ShieldAlert size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>
      </div>

      {/* Route Clear Button */}
      {destination && !showItineraryRoute && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[1000]">
          <button
            onClick={() => setDestination(null)}
            className="bg-gray-900/90 backdrop-blur text-white px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-black transition-colors"
          >
            <X size={16} /> Exit Navigation
          </button>
        </div>
      )}

      {/* Smart Itinerary Overlay (Google Maps Style Driving Bar) */}
      {showItineraryRoute && itineraryStops.length > 0 && (
        <div className="absolute top-[80px] left-4 right-4 z-[1000]">
          <div className="bg-green-700 rounded-2xl p-4 text-white shadow-xl flex items-center justify-between">
            <div>
              <p className="font-bold flex items-center gap-1"><MapPin size={16} /> Tour Itinerary Active</p>
              {routeStats ? (
                <div className="flex items-center gap-3 mt-1 opacity-90">
                  <span className="font-bold text-xl">{Math.round(routeStats.time / 60)} min</span>
                  <span className="text-sm">· {(routeStats.distance / 1000).toFixed(1)} km</span>
                </div>
              ) : (
                <p className="text-sm opacity-80 mt-1 flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin" /> Calculating...
                </p>
              )}
            </div>
            <button 
              onClick={() => {
                setShowItineraryRoute(false);
                setRouteStats(null);
              }}
              className="bg-green-800 hover:bg-green-900 p-3 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 
        ==================================================
        BOTTOM SHEET: Nearest Amenities
        ==================================================
      */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-[2000] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setBottomSheetOpen(false)}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors" />
        </div>
        
        <div className="p-5 pt-2 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-900">Nearest Amenities</h2>
            <button onClick={() => setBottomSheetOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full">
              <ChevronDown size={20} />
            </button>
          </div>

          {!userLocation ? (
            <div className="py-8 flex flex-col items-center justify-center text-gray-500">
              <Navigation size={32} className="mb-2 text-gray-300 animate-pulse" />
              <p className="font-medium">Locating you...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Hospital Card */}
              <div className="border border-gray-100 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🏥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {nearest.hospital?.tags?.name || 'Nearest Hospital'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-600 font-bold text-sm">Open</span>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-600 text-sm">
                      {nearest.hospital ? Math.round(L.latLng(userLocation.lat, userLocation.lng).distanceTo(L.latLng(nearest.hospital.lat, nearest.hospital.lon))) + ' m away' : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <button 
                  disabled={!nearest.hospital}
                  onClick={() => {
                    setDestination([nearest.hospital.lat, nearest.hospital.lon]);
                    setBottomSheetOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </button>
              </div>

              {/* Police Card */}
              <div className="border border-gray-100 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🚓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {nearest.police?.tags?.name || 'Nearest Police Station'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-600 font-bold text-sm">24/7</span>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-600 text-sm">
                      {nearest.police ? Math.round(L.latLng(userLocation.lat, userLocation.lng).distanceTo(L.latLng(nearest.police.lat, nearest.police.lon))) + ' m away' : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <button 
                  disabled={!nearest.police}
                  onClick={() => {
                    setDestination([nearest.police.lat, nearest.police.lon]);
                    setBottomSheetOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </button>
              </div>

              {/* Toilet Card */}
              <div className="border border-gray-100 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🚻</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {nearest.toilets?.tags?.name || 'Public Toilet'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600 text-sm">
                      {nearest.toilets ? Math.round(L.latLng(userLocation.lat, userLocation.lng).distanceTo(L.latLng(nearest.toilets.lat, nearest.toilets.lon))) + ' m away' : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <button 
                  disabled={!nearest.toilets}
                  onClick={() => {
                    setDestination([nearest.toilets.lat, nearest.toilets.lon]);
                    setBottomSheetOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
