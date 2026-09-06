export interface Festival {
  id: string;
  name: string;
  slug: string;
  year: number;
  description: string | null;
  startDate: string;
  endDate: string;
  bannerUrl: string | null;
  primaryColor: string | null;
  createdAt: string;
  calendarDays?: FestivalCalendarDay[];
}

export interface FestivalCalendarDay {
  id: string;
  festivalId: string;
  dayName: string;
  tithiDetails: string;
  calendarDate: string;
  auspiciousTimings: string | null;
  isCountdownTarget: boolean;
  orderIndex: number;
}

export interface Pandal {
  id: string;
  festivalId: string;
  name: string;
  slug: string;
  zone: string;
  area: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string | null;
  latitude: number;
  longitude: number;
  verificationStatus: string;
  isFeatured: boolean;
  sourceName: string | null;
  createdAt: string;
  editions?: PandalEdition[];
}

export interface PandalEdition {
  id: string;
  pandalId: string;
  year: number;
  theme: string | null;
  themeDescription: string | null;
  idolArtist: string | null;
  pandalArtist: string | null;
  pujaTimings: string | null;
  openingDate: string | null;
  closingDate: string | null;
  images: string;
  awards: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  type: 'DHAK' | 'SHANKHA' | 'SOUNDSCAPE';
  filePath: string;
  duration: number | null;
  sourceName: string | null;
  licenseType: string | null;
}

export type Language = 'en' | 'bn' | 'hi';

export interface FestivalContextValue {
  selectedFestival: Festival | null;
  setSelectedFestival: (festival: Festival) => void;
  festivals: Festival[];
  calendarDays: FestivalCalendarDay[];
  isLoading: boolean;
}
