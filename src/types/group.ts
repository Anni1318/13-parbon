export interface GroupMember {
  id: string;
  name: string;
  isCurrentUser?: boolean;
  role?: 'ADMIN' | 'MEMBER';
  status: 'Not moving' | 'Walking' | 'By car' | 'In metro';
  locationName: string;
  distance?: string;     // e.g. "450 m"
  walkTime?: string;     // e.g. "5m"
  carTime?: string;      // e.g. "2m"
  batteryLevel?: number; // e.g. 85
  avatarInitials: string;
  avatarBgColor?: string;
  coordinates?: { lat: number; lng: number };
}

export type GroupTab = 'Members' | 'Chat' | 'Activity' | 'Summary';
