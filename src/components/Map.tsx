'use client';

import { useEffect, useState, useRef, useCallback, useMemo, Suspense } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiIsLoaded,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Pandal } from '@/lib/types';
import scrapedPandalsFallback from '@/data/scraped-pandals.json';
import {
  isPandalInTour,
  toggleTourStop,
} from '@/lib/itinerary';
import {
  Navigation,
  Loader2,
  Star,
  ShieldAlert,
  MapPin,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Compass,
  List,
  RotateCcw,
  Share2,
  Check,
  Plus,
  Bookmark,
} from 'lucide-react';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // In km
}

const DEFAULT_ZONES = [
  'All',
  'North Kolkata',
  'South Kolkata',
  'Central Kolkata',
  'Salt Lake',
  'Behala',
  'Howrah',
  'East Kolkata',
  'North 24 Parganas',
  'South 24 Parganas',
  'Hooghly',
  'Other Zone',
];

function MapController({
  onMapReady,
  userLocation,
  followMode,
  selectedLocation,
}: {
  onMapReady: (map: google.maps.Map) => void;
  userLocation: { lat: number; lng: number } | null;
  followMode: boolean;
  selectedLocation: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    if (map && userLocation && followMode) {
      map.panTo(userLocation);
    }
  }, [map, userLocation, followMode]);

  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo(selectedLocation);
      map.setZoom(16);
    }
  }, [map, selectedLocation]);

  return null;
}

function PandalGoogleMapInner() {
  const isLoaded = useApiIsLoaded();
  const apiStatus = useApiLoadingStatus();

  const searchParams = useSearchParams();
  const urlPandal = searchParams.get('pandal');
  const urlZone = searchParams.get('zone');

  const [pandals, setPandals] = useState<any[]>(() => scrapedPandalsFallback as any);
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState('All');

  // Drawer and Quick actions state
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);
  const [drawerSort, setDrawerSort] = useState<'proximity' | 'featured' | 'name'>('proximity');
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [inTourMap, setInTourMap] = useState<Record<string, boolean>>({});

  // Live Location & GPS
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [isFollowMode, setIsFollowMode] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Selected Pandal for InfoWindow & Preview Card
  const [selectedPandal, setSelectedPandal] = useState<any | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<any | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Amenities & Filter states
  const [showPandals, setShowPandals] = useState(true);
  const [showToilets, setShowToilets] = useState(false);
  const [showPolice, setShowPolice] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  // Bottom Sheet for Nearest Amenities
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [nearest, setNearest] = useState<{ hospital: any; police: any; toilets: any }>({
    hospital: null,
    police: null,
    toilets: null,
  });

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  // Fetch Pandal Data from Next.js Prisma API, falling back to scraped dataset
  useEffect(() => {
    fetch('/api/pandals')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPandals(data);
        } else {
          setPandals(scrapedPandalsFallback as any);
        }
        setLoading(false);
      })
      .catch(() => {
        setPandals(scrapedPandalsFallback as any);
        setLoading(false);
      });
  }, []);

  // Sync Tour Map from localStorage
  const updateTourMap = useCallback(() => {
    const map: Record<string, boolean> = {};
    pandals.forEach((p) => {
      map[p.id] = isPandalInTour(p.id) || (p.slug ? isPandalInTour(p.slug) : false);
    });
    setInTourMap(map);
  }, [pandals]);

  useEffect(() => {
    updateTourMap();
    const listener = () => updateTourMap();
    window.addEventListener('tour_itinerary_updated', listener);
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('tour_itinerary_updated', listener);
      window.removeEventListener('storage', listener);
    };
  }, [updateTourMap]);

  // Continuous High-Accuracy Live GPS Tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    // Rapid initial lock
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading, speed } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setAccuracy(accuracy);
        if (heading !== null && !isNaN(heading)) setHeading(heading);
        if (speed !== null && !isNaN(speed)) setSpeed(speed);
        setGeoError(null);
      },
      (err) => {
        if (err.code === 1) {
          setGeoError('Location permission denied. Please allow GPS access in browser settings.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Continuous watchPosition
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading, speed } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setAccuracy(accuracy);
        if (heading !== null && !isNaN(heading)) setHeading(heading);
        if (speed !== null && !isNaN(speed)) setSpeed(speed);
        setGeoError(null);
      },
      (err) => {
        if (err.code === 1) {
          setGeoError('Location access denied. Please enable GPS permissions in browser settings.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Real-time Smartphone Compass Heading
  useEffect(() => {
    const handleOrientation = (e: any) => {
      let compass = e.webkitCompassHeading;
      if (compass === undefined && e.alpha !== null && e.alpha !== undefined) {
        compass = (360 - e.alpha) % 360;
      }
      if (compass !== undefined && compass !== null && !isNaN(compass)) {
        setHeading(Math.round(compass));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Fetch Public Amenities from server proxy
  const fetchAmenities = useCallback(async () => {
    if (!showToilets && !showPolice && !showHospitals) {
      setAmenities([]);
      return;
    }

    setLoadingAmenities(true);
    let bbox = '22.45,88.25,22.65,88.45';
    if (mapInstance) {
      const bounds = mapInstance.getBounds();
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        bbox = `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}`;
      }
    }

    try {
      const url = `/api/amenities?bbox=${bbox}&toilets=${showToilets}&police=${showPolice}&hospitals=${showHospitals}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAmenities(data);
      }
    } catch (e) {
      console.error('Failed to fetch amenities:', e);
    } finally {
      setLoadingAmenities(false);
    }
  }, [showToilets, showPolice, showHospitals, mapInstance]);

  useEffect(() => {
    if (showToilets || showPolice || showHospitals) {
      fetchAmenities();
    } else {
      setAmenities([]);
    }
  }, [showToilets, showPolice, showHospitals, fetchAmenities]);

  // Calculate Nearest Amenities
  useEffect(() => {
    if (!bottomSheetOpen || !userLocation || amenities.length === 0) return;

    let minH = Infinity,
      minP = Infinity,
      minT = Infinity;
    let nH = null,
      nP = null,
      nT = null;

    amenities.forEach((a) => {
      const aLat = Number(a.lat);
      const aLon = Number(a.lon);
      if (isNaN(aLat) || isNaN(aLon)) return;
      const d = calculateDistance(userLocation.lat, userLocation.lng, aLat, aLon);
      const amType = a.tags?.amenity;
      if (amType === 'hospital' && d < minH) {
        minH = d;
        nH = a;
      }
      if (amType === 'police' && d < minP) {
        minP = d;
        nP = a;
      }
      if (amType === 'toilets' && d < minT) {
        minT = d;
        nT = a;
      }
    });

    setNearest({ hospital: nH, police: nP, toilets: nT });
  }, [amenities, userLocation, bottomSheetOpen]);

  const handleLocate = () => {
    setIsFollowMode(true);
    setGeoError(null);
    if (userLocation && mapInstance) {
      mapInstance.panTo(userLocation);
      mapInstance.setZoom(16);
    } else if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setAccuracy(pos.coords.accuracy);
          if (mapInstance) {
            mapInstance.panTo(loc);
            mapInstance.setZoom(16);
          }
        },
        (err) => {
          if (err.code === 1) {
            setGeoError('Location permission denied. Please allow location access in browser settings.');
          } else {
            setGeoError('Searching for GPS satellite signal. Ensure location service is active.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Dynamic zones extracted from pandals data merged with defaults
  const dynamicZones = useMemo(() => {
    const zonesSet = new Set<string>(DEFAULT_ZONES);
    pandals.forEach((p) => {
      if (p.zone && typeof p.zone === 'string' && p.zone.trim()) {
        zonesSet.add(p.zone.trim());
      }
    });
    return Array.from(zonesSet);
  }, [pandals]);

  // Handle URL zone parameter and auto-pan to zone center
  useEffect(() => {
    if (urlZone) {
      const matched = dynamicZones.find(
        (z) => z.toLowerCase() === urlZone.toLowerCase()
      );
      const zoneName = matched || urlZone;
      setSelectedZone(zoneName);

      const zoneCenters: Record<string, { lat: number; lng: number; zoom: number }> = {
        'north kolkata': { lat: 22.598, lng: 88.371, zoom: 14 },
        'north': { lat: 22.598, lng: 88.371, zoom: 14 },
        'south kolkata': { lat: 22.518, lng: 88.358, zoom: 14 },
        'south': { lat: 22.518, lng: 88.358, zoom: 14 },
        'central kolkata': { lat: 22.565, lng: 88.355, zoom: 14 },
        'central': { lat: 22.565, lng: 88.355, zoom: 14 },
        'salt lake': { lat: 22.585, lng: 88.415, zoom: 14 },
        'east kolkata': { lat: 22.565, lng: 88.410, zoom: 14 },
        'east': { lat: 22.565, lng: 88.410, zoom: 14 },
        'behala': { lat: 22.502, lng: 88.318, zoom: 14 },
        'howrah': { lat: 22.590, lng: 88.310, zoom: 14 },
      };

      const center = zoneCenters[zoneName.toLowerCase().trim()];
      if (center && mapInstance) {
        mapInstance.panTo({ lat: center.lat, lng: center.lng });
        mapInstance.setZoom(center.zoom);
      }
    }
  }, [urlZone, dynamicZones, mapInstance]);

  // Filtered Pandals by Zone
  const filteredPandals = useMemo(() => {
    if (selectedZone === 'All') return pandals;
    return pandals.filter(
      (p) => p.zone?.toLowerCase().trim() === selectedZone.toLowerCase().trim()
    );
  }, [pandals, selectedZone]);

  // Autocomplete Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return pandals
      .filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const zoneMatch = p.zone?.toLowerCase().includes(q);
        const areaMatch = p.area?.toLowerCase().includes(q);
        const addressMatch = p.address?.toLowerCase().includes(q);
        const themeMatch = p.editions?.[0]?.theme?.toLowerCase().includes(q);
        return nameMatch || zoneMatch || areaMatch || addressMatch || themeMatch;
      })
      .slice(0, 8);
  }, [pandals, searchQuery]);

  const handleSelectPandal = useCallback(
    (pandal: any) => {
      setSelectedPandal(pandal);
      setSelectedAmenity(null);
      setIsSearchFocused(false);
      setIsFollowMode(false);
      if (mapInstance) {
        mapInstance.panTo({ lat: Number(pandal.latitude), lng: Number(pandal.longitude) });
        mapInstance.setZoom(16);
      }
    },
    [mapInstance]
  );

  // Handle URL pandal parameter
  useEffect(() => {
    if (urlPandal && pandals.length > 0) {
      const found = pandals.find(
        (p) =>
          p.slug?.toLowerCase() === urlPandal.toLowerCase() ||
          p.id === urlPandal ||
          p.name?.toLowerCase() === urlPandal.toLowerCase()
      );
      if (found) {
        handleSelectPandal(found);
      }
    }
  }, [urlPandal, pandals, handleSelectPandal]);

  const handleResetKolkataView = () => {
    if (mapInstance) {
      mapInstance.panTo({ lat: 22.5726, lng: 88.3639 });
      mapInstance.setZoom(12);
    }
    setIsFollowMode(false);
    setSelectedPandal(null);
  };

  const handleSharePandal = (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/map?pandal=${encodeURIComponent(p.slug || p.id)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setShareToast(`Link copied for ${p.name}!`);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleToggleTour = (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowIn = toggleTourStop(p);
    setInTourMap((prev) => ({ ...prev, [p.id]: isNowIn }));
    setShareToast(isNowIn ? `Added "${p.name}" to tour plan!` : `Removed "${p.name}" from tour plan`);
    setTimeout(() => setShareToast(null), 2500);
  };

  // Sorted list for slide-over drawer
  const sortedDrawerPandals = useMemo(() => {
    const list = [...filteredPandals];
    if (drawerSort === 'proximity' && userLocation) {
      return list.sort((a, b) => {
        const dA = calculateDistance(userLocation.lat, userLocation.lng, Number(a.latitude), Number(a.longitude));
        const dB = calculateDistance(userLocation.lat, userLocation.lng, Number(b.latitude), Number(b.longitude));
        return dA - dB;
      });
    }
    if (drawerSort === 'featured') {
      return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    if (drawerSort === 'name') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [filteredPandals, drawerSort, userLocation]);

  // Loading state while Google Maps script is fetching
  if (!isLoaded || apiStatus === APILoadingStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-center p-6">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🪔</div>
        </div>
        <h2 className="text-base font-bold text-gray-900">Loading Google Maps...</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          Loading 400+ Kolkata Durga Puja pandals, themes, and live GPS features
        </p>
      </div>
    );
  }

  // Graceful Fallback if API key is unauthorized
  if (apiStatus === APILoadingStatus.AUTH_FAILURE || apiStatus === APILoadingStatus.FAILED) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-amber-50/50 text-center p-6">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-3">
          🗺️
        </div>
        <h2 className="text-base font-bold text-gray-900">Google Maps Authentication</h2>
        <p className="text-xs text-gray-600 mt-1 max-w-sm">
          Please verify that your Google Cloud Console has <strong>Maps JavaScript API</strong> enabled for your key.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-100 overflow-hidden">
      {/* 
        ==================================================
        TOP OVERLAY: Zone Chips & Public Amenities
        ==================================================
      */}
      <div className="absolute top-3 md:top-4 left-0 right-0 z-10 px-4 py-1 pointer-events-none flex flex-col gap-2.5">
        {/* Horizontal Chips */}
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* List View Toggle */}
          <button
            onClick={() => setIsListDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all text-xs font-bold active:scale-95"
          >
            <List size={14} /> List View ({filteredPandals.length})
          </button>

          {/* Reset Map View to Kolkata Center */}
          <button
            onClick={handleResetKolkataView}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 bg-white/95 hover:bg-gray-100 text-gray-700 shadow-sm transition-all text-xs font-semibold"
            title="Reset View to Central Kolkata"
          >
            <RotateCcw size={13} /> Reset
          </button>

          <button
            onClick={() => setShowPandals(!showPandals)}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm transition-all text-xs font-bold ${
              showPandals
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🪔</span> Pandals ({pandals.length})
          </button>

          {/* Zone Selector */}
          <div className="flex items-center gap-1.5">
            {dynamicZones.map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  selectedZone === z
                    ? 'bg-amber-600 text-white shadow-amber-600/30'
                    : 'bg-white/95 text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="shrink-0 w-px h-5 bg-gray-300 mx-1" />

          {/* Amenity Toggles */}
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-all text-xs font-bold ${
              showHospitals
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🏥</span> Hospitals
          </button>

          <button
            onClick={() => setShowPolice(!showPolice)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-all text-xs font-bold ${
              showPolice
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🚓</span> Police
          </button>

          <button
            onClick={() => setShowToilets(!showToilets)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-all text-xs font-bold ${
              showToilets
                ? 'bg-sky-50 border-sky-300 text-sky-900'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🚻</span> Toilets
          </button>
        </div>

        {/* Geo Error Alert Banner */}
        {geoError && (
          <div className="pointer-events-auto flex items-center justify-between gap-2 px-3.5 py-2 bg-amber-500/95 backdrop-blur-md text-white rounded-2xl shadow-lg text-xs font-semibold max-w-sm border border-amber-400">
            <span className="flex items-center gap-1.5">⚠️ {geoError}</span>
            <button
              onClick={() => setGeoError(null)}
              className="p-1 hover:bg-amber-600 rounded-full font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live GPS Tracker badge */}
        {userLocation ? (
          <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-gray-200 text-xs font-semibold text-gray-800 w-fit">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live GPS {accuracy ? `(±${Math.round(accuracy)}m)` : 'Active'}</span>
            <button
              onClick={() => setIsFollowMode(!isFollowMode)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                isFollowMode
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isFollowMode ? '📍 Follow ON' : 'Follow OFF'}
            </button>
          </div>
        ) : (
          !geoError && (
            <button
              onClick={handleLocate}
              className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md text-xs font-bold transition-all w-fit active:scale-95"
            >
              <Compass size={14} className="animate-spin" />
              <span>Enable Live GPS Tracking</span>
            </button>
          )
        )}
      </div>

      {loading && pandals.length === 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <Loader2 size={32} className="text-amber-500 animate-spin" />
        </div>
      )}

      {/* 
        ==================================================
        GOOGLE MAP CANVAS
        ==================================================
      */}
      <div className="flex-1 w-full h-full relative z-0">
        <GoogleMap
          defaultZoom={13}
          defaultCenter={{ lat: 22.5726, lng: 88.3639 }}
          mapId="DEMO_MAP_ID"
          className="w-full h-full"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={false}
          streetViewControl={false}
          mapTypeControl={false}
        >
          <MapController
            onMapReady={handleMapReady}
            userLocation={userLocation}
            followMode={isFollowMode}
            selectedLocation={
              selectedPandal
                ? { lat: Number(selectedPandal.latitude), lng: Number(selectedPandal.longitude) }
                : null
            }
          />

          {/* User Live Location Marker */}
          {userLocation && (
            <AdvancedMarker
              position={userLocation}
              title="Your Live Position"
              zIndex={200}
            >
              <div className="relative flex items-center justify-center w-8 h-8 pointer-events-none">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60" />
                <div className="relative w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white">
                  {heading !== null ? (
                    <div
                      style={{
                        transform: `rotate(${heading}deg)`,
                        fontSize: '9px',
                        lineHeight: 1,
                      }}
                    >
                      ▲
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Pandal Markers */}
          {showPandals &&
            filteredPandals.map((p) => {
              const isSelected = selectedPandal?.id === p.id;
              const isFeatured = Boolean(p.isFeatured);

              return (
                <AdvancedMarker
                  key={p.id}
                  position={{ lat: Number(p.latitude), lng: Number(p.longitude) }}
                  onClick={() => {
                    setSelectedPandal(p);
                    setSelectedAmenity(null);
                    if (mapInstance) {
                      mapInstance.panTo({ lat: Number(p.latitude), lng: Number(p.longitude) });
                    }
                  }}
                  title={`${p.name} (${p.zone})`}
                  zIndex={isSelected ? 150 : isFeatured ? 20 : 10}
                >
                  {isSelected ? (
                    <div className="relative flex items-center justify-center cursor-pointer transition-transform duration-200 scale-125">
                      <div className="absolute -inset-1 bg-amber-500 rounded-full animate-ping opacity-75" />
                      <div className="relative w-9 h-9 bg-amber-600 border-2 border-white rounded-full shadow-2xl flex items-center justify-center text-white text-base font-bold">
                        🪔
                      </div>
                    </div>
                  ) : isFeatured ? (
                    <div className="relative cursor-pointer transition-transform duration-150 hover:scale-125">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 border-2 border-white shadow-md flex items-center justify-center text-white text-sm">
                        ⭐
                      </div>
                    </div>
                  ) : (
                    <div className="relative cursor-pointer transition-transform duration-150 hover:scale-125">
                      <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs">
                        🪔
                      </div>
                    </div>
                  )}
                </AdvancedMarker>
              );
            })}

          {/* Public Amenity Markers */}
          {amenities.map((amenity, idx) => {
            const amType = amenity.tags?.amenity;
            let emoji = '🚻';
            let bg = 'bg-sky-600';
            if (amType === 'hospital') {
              emoji = '🏥';
              bg = 'bg-red-600';
            } else if (amType === 'police') {
              emoji = '🚓';
              bg = 'bg-blue-700';
            }

            return (
              <AdvancedMarker
                key={amenity.id || idx}
                position={{ lat: Number(amenity.lat), lng: Number(amenity.lon) }}
                onClick={() => {
                  setSelectedAmenity(amenity);
                  setSelectedPandal(null);
                }}
                zIndex={5}
              >
                <div
                  className={`w-7 h-7 rounded-full ${bg} border-2 border-white shadow-md flex items-center justify-center text-white text-xs cursor-pointer hover:scale-110 transition-transform`}
                >
                  {emoji}
                </div>
              </AdvancedMarker>
            );
          })}

          {/* 
            ==================================================
            INFOWINDOW: Pandal Name, Zone & Current Theme
            ==================================================
          */}
          {selectedPandal && (
            <InfoWindow
              position={{
                lat: Number(selectedPandal.latitude),
                lng: Number(selectedPandal.longitude),
              }}
              onCloseClick={() => setSelectedPandal(null)}
              maxWidth={320}
            >
              <div className="p-1 font-sans text-gray-900">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {selectedPandal.zone || 'Kolkata'}
                  </span>
                  {selectedPandal.isFeatured && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <Star size={11} className="fill-amber-500 text-amber-500" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-gray-900 leading-snug m-0">
                  {selectedPandal.name}
                </h3>

                <p className="text-xs text-gray-600 mt-0.5 mb-2 leading-relaxed">
                  {selectedPandal.address || selectedPandal.area || 'Kolkata, West Bengal'}
                </p>

                {/* Current Year's Theme */}
                <div className="my-2 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200/80">
                  <p className="text-[11px] font-bold text-amber-950 flex items-center gap-1 m-0">
                    <span>🎨</span> Current Theme{' '}
                    {selectedPandal.editions?.[0]?.year
                      ? `(${selectedPandal.editions[0].year})`
                      : ''}
                    :
                  </p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5 m-0 leading-relaxed">
                    {selectedPandal.editions?.[0]?.theme ||
                      'Traditional Celebrations & Heritage Art'}
                  </p>
                  {selectedPandal.editions?.[0]?.themeDescription && (
                    <p className="text-[11px] text-gray-600 mt-1 m-0 line-clamp-2">
                      {selectedPandal.editions[0].themeDescription}
                    </p>
                  )}
                </div>

                {userLocation && (
                  <p className="text-[11px] font-bold text-blue-600 mb-2.5 flex items-center gap-1">
                    <MapPin size={12} />
                    {(() => {
                      const d = calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        Number(selectedPandal.latitude),
                        Number(selectedPandal.longitude)
                      );
                      return d < 1
                        ? `${Math.round(d * 1000)} m from your live position`
                        : `${d.toFixed(1)} km from your live position`;
                    })()}
                  </p>
                )}

                {/* Action Buttons in InfoWindow */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleTour(selectedPandal)}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                      inTourMap[selectedPandal.id]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    {inTourMap[selectedPandal.id] ? <Check size={12} /> : <Plus size={12} />}
                    {inTourMap[selectedPandal.id] ? 'In Tour' : '+ Tour'}
                  </button>
                  <button
                    onClick={(e) => handleSharePandal(selectedPandal, e)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Share2 size={12} /> Share
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1.5 mt-1 border-t border-gray-100">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.latitude},${selectedPandal.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors text-center"
                  >
                    <Navigation size={11} className="rotate-45" /> Directions
                  </a>
                  <Link
                    href={`/pandals/${selectedPandal.slug || selectedPandal.id}`}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors text-center"
                  >
                    Details <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* InfoWindow for Public Amenity */}
          {selectedAmenity && (
            <InfoWindow
              position={{
                lat: Number(selectedAmenity.lat),
                lng: Number(selectedAmenity.lon),
              }}
              onCloseClick={() => setSelectedAmenity(null)}
              maxWidth={260}
            >
              <div className="p-1 font-sans text-gray-900">
                <p className="text-xs font-bold text-gray-500 uppercase m-0">
                  {selectedAmenity.tags?.amenity || 'Amenity'}
                </p>
                <h4 className="font-extrabold text-sm text-gray-900 m-0 mt-0.5">
                  {selectedAmenity.tags?.name || 'Public Facility'}
                </h4>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedAmenity.lat},${selectedAmenity.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 py-1.5 px-3 bg-blue-600 text-white text-xs font-bold rounded-lg"
                >
                  <Navigation size={11} className="rotate-45" /> Navigate Here
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* 
        ==================================================
        SELECTED PANDAL PREVIEW CARD (Google Maps Style)
        ==================================================
      */}
      {selectedPandal && !isSearchFocused && (
        <div className="absolute bottom-24 md:bottom-28 left-4 right-4 md:left-6 md:max-w-md z-20 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {selectedPandal.zone || 'Kolkata'}
                  </span>
                  {selectedPandal.isFeatured && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <Star size={12} className="fill-amber-500 text-amber-500" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-gray-900 text-base leading-tight truncate">
                  {selectedPandal.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  {selectedPandal.address || selectedPandal.area || 'Kolkata'}
                </p>
                {selectedPandal.editions?.[0]?.theme && (
                  <p className="text-xs font-semibold text-amber-800 mt-1 line-clamp-1">
                    🎨 Theme: {selectedPandal.editions[0].theme}
                  </p>
                )}
                {userLocation && (
                  <p className="text-[11px] font-semibold text-blue-600 mt-1 flex items-center gap-1">
                    <MapPin size={12} />
                    {(() => {
                      const d = calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        Number(selectedPandal.latitude),
                        Number(selectedPandal.longitude)
                      );
                      return d < 1
                        ? `${Math.round(d * 1000)} m from your live position`
                        : `${d.toFixed(1)} km from your live position`;
                    })()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedPandal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleToggleTour(selectedPandal)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                  inTourMap[selectedPandal.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                }`}
              >
                {inTourMap[selectedPandal.id] ? <Check size={14} /> : <Plus size={14} />}
                {inTourMap[selectedPandal.id] ? 'Added to Tour' : '+ Add to Tour'}
              </button>

              <button
                onClick={(e) => handleSharePandal(selectedPandal, e)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                <Share2 size={14} /> Share Pandal
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.latitude},${selectedPandal.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 text-center"
              >
                <Navigation size={14} className="rotate-45" /> Directions
              </a>
              <Link
                href={`/pandals/${selectedPandal.slug || selectedPandal.id}`}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all active:scale-95 text-center"
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 
        ==================================================
        SEARCH AUTOCOMPLETE RESULTS (Dropdown)
        ==================================================
      */}
      {isSearchFocused && searchQuery.trim().length > 0 && (
        <div className="absolute bottom-20 md:bottom-24 left-4 right-20 md:right-24 z-30 pointer-events-auto">
          <div className="bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-72 overflow-y-auto divide-y divide-gray-100">
            {searchResults.length > 0 ? (
              searchResults.map((p) => {
                const dist = userLocation
                  ? calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      Number(p.latitude),
                      Number(p.longitude)
                    )
                  : null;

                return (
                  <button
                    key={p.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectPandal(p);
                    }}
                    className="w-full text-left p-3.5 hover:bg-amber-50/70 active:bg-amber-100/70 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform">
                        {p.isFeatured ? '⭐' : '🪔'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                          {p.isFeatured && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {p.area ? `${p.area} • ` : ''}
                          {p.zone}
                        </p>
                      </div>
                    </div>
                    {dist !== null && (
                      <span className="text-[11px] font-semibold text-gray-400 shrink-0 ml-2">
                        {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500 text-xs font-medium">
                No pandals matching &ldquo;{searchQuery}&rdquo; found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 
        ==================================================
        BOTTOM SEARCH BAR
        ==================================================
      */}
      <div className="absolute bottom-6 md:bottom-8 left-4 right-20 md:right-24 z-20 pointer-events-none pb-safe">
        <div className="pointer-events-auto bg-white rounded-full shadow-lg flex items-center px-4 py-2.5 border border-gray-200 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
          <Search size={20} className="text-gray-500 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsSearchFocused(false), 250);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleSelectPandal(searchResults[0]);
              } else if (e.key === 'Escape') {
                setIsSearchFocused(false);
              }
            }}
            placeholder="Search 400+ pandals, zones, or themes..."
            className="w-full bg-transparent outline-none text-gray-800 text-[14px] md:text-[15px] font-medium placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 mr-1 shrink-0"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-sm">
            🪔
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Right side) */}
      <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-20 flex flex-col gap-3 pb-safe">
        {loadingAmenities && (
          <div className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center border border-gray-200">
            <Loader2 size={24} className="text-blue-500 animate-spin" />
          </div>
        )}
        <button
          onClick={handleLocate}
          title={
            isFollowMode && userLocation ? 'Live Tracking ON (Centering)' : 'Track My Location'
          }
          className={`rounded-full p-3 shadow-lg border transition-all flex items-center justify-center relative active:scale-95 ${
            isFollowMode && userLocation
              ? 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-blue-500/40 ring-4 ring-blue-400/40'
              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <Navigation
            size={24}
            className={isFollowMode && userLocation ? 'fill-white animate-pulse' : 'fill-gray-700'}
          />
          {isFollowMode && userLocation && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
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
          title="Emergency Amenities"
        >
          <ShieldAlert size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>
      </div>

      {/* 
        ==================================================
        BOTTOM SHEET: Nearest Amenities
        ==================================================
      */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${
          bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className="w-full flex justify-center pt-3 pb-1"
          onClick={() => setBottomSheetOpen(false)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors" />
        </div>

        <div className="p-5 pt-2 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-900">Nearest Amenities</h2>
            <button
              onClick={() => setBottomSheetOpen(false)}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full"
            >
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
                      {nearest.hospital
                        ? Math.round(
                            calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              Number(nearest.hospital.lat),
                              Number(nearest.hospital.lon)
                            ) * 1000
                          ) + ' m away'
                        : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <a
                  href={
                    nearest.hospital
                      ? `https://www.google.com/maps/dir/?api=1&destination=${nearest.hospital.lat},${nearest.hospital.lon}`
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </a>
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
                      {nearest.police
                        ? Math.round(
                            calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              Number(nearest.police.lat),
                              Number(nearest.police.lon)
                            ) * 1000
                          ) + ' m away'
                        : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <a
                  href={
                    nearest.police
                      ? `https://www.google.com/maps/dir/?api=1&destination=${nearest.police.lat},${nearest.police.lon}`
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </a>
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
                      {nearest.toilets
                        ? Math.round(
                            calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              Number(nearest.toilets.lat),
                              Number(nearest.toilets.lon)
                            ) * 1000
                          ) + ' m away'
                        : 'Scanning...'}
                    </span>
                  </div>
                </div>
                <a
                  href={
                    nearest.toilets
                      ? `https://www.google.com/maps/dir/?api=1&destination=${nearest.toilets.lat},${nearest.toilets.lon}`
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-md transition-colors"
                >
                  <Navigation size={18} className="rotate-45" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 
        ==================================================
        TOAST NOTIFICATION (Clipboard & Tour Feedback)
        ==================================================
      */}
      {shareToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl border border-amber-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="text-amber-400 text-sm">✨</span>
          <span>{shareToast}</span>
        </div>
      )}

      {/* 
        ==================================================
        SLIDE-OVER DRAWER: Pandal List & Tour Quick-Add
        ==================================================
      */}
      <div
        className={`absolute inset-y-0 left-0 z-40 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isListDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <span>🏛️</span> Pandals List
            </h3>
            <p className="text-xs text-gray-500">
              {filteredPandals.length} pandal{filteredPandals.length !== 1 ? 's' : ''} in {selectedZone}
            </p>
          </div>
          <button
            onClick={() => setIsListDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            title="Close Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sort & Filter controls */}
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs bg-gray-50/50">
          <span className="font-semibold text-gray-500">Sort:</span>
          <div className="flex items-center gap-1">
            {userLocation && (
              <button
                onClick={() => setDrawerSort('proximity')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  drawerSort === 'proximity'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                📍 Nearest
              </button>
            )}
            <button
              onClick={() => setDrawerSort('featured')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                drawerSort === 'featured'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => setDrawerSort('name')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                drawerSort === 'name'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔤 A-Z
            </button>
          </div>
        </div>

        {/* Drawer List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
          {sortedDrawerPandals.map((p) => {
            const isSelected = selectedPandal?.id === p.id;
            const dist = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  Number(p.latitude),
                  Number(p.longitude)
                )
              : null;
            const isInTour = inTourMap[p.id] || false;

            return (
              <div
                key={p.id}
                onClick={() => {
                  handleSelectPandal(p);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsListDrawerOpen(false);
                  }
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-50 border border-amber-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-gray-900 truncate">{p.name}</span>
                      {p.isFeatured && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {p.area || p.address || p.zone}
                    </p>
                    {p.editions?.[0]?.theme && (
                      <p className="text-[11px] text-amber-800 truncate mt-0.5">
                        🎨 {p.editions[0].theme}
                      </p>
                    )}
                    {dist !== null && (
                      <p className="text-[11px] font-semibold text-blue-600 mt-1 flex items-center gap-1">
                        <MapPin size={11} />
                        {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`} away
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleTour(p, e)}
                      title={isInTour ? 'Remove from tour' : 'Add to tour'}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isInTour
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-800'
                      }`}
                    >
                      {isInTour ? <Check size={14} /> : <Plus size={14} />}
                      <span className="text-[10px]">{isInTour ? 'Saved' : 'Tour'}</span>
                    </button>

                    <button
                      onClick={(e) => handleSharePandal(p, e)}
                      title="Share link"
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Map() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-center p-6">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">🪔</div>
            </div>
            <h2 className="text-base font-bold text-gray-900">Loading Kolkata Puja Map...</h2>
          </div>
        }
      >
        <PandalGoogleMapInner />
      </Suspense>
    </APIProvider>
  );
}
