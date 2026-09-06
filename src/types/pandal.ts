export interface PandalTheme {
  year: number;
  themeName: string;
  description?: string;
}

export interface PandalAward {
  year: number;
  awardName: string;
  category: string; // fallback to 'General' if not explicitly defined
}

export interface Pandal {
  id: string;
  name: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  themes: PandalTheme[];
  awards: PandalAward[];
}
