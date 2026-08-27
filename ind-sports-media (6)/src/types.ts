export interface PlayEvent {
  id: string;
  time: string;
  quarter: string;
  team: 'home' | 'away' | 'neutral';
  teamName: string;
  text: string;
  isScoring?: boolean;
  scoreChange?: string;
  downInfo?: string;
}

export interface SocialClip {
  id: string;
  platform: 'x' | 'instagram' | 'tiktok' | 'youtube' | 'custom' | 'upload';
  type: 'video' | 'photo' | 'post';
  title: string;
  author: string;
  url?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption: string;
  time: string;
  team: 'home' | 'away' | 'neutral';
  likes: number;
  createdAt: string;
}

export interface TeamData {
  name: string;
  shortName: string;
  mascot: string;
  record: string;
  color: string;
  textColor: string;
  logoUrl?: string;
  score: number;
  qScores: [number, number, number, number, number];
  stats: {
    passingYds: number;
    rushingYds: number;
    firstDowns: number;
    turnovers: number;
    penalties: string;
  };
}

export interface GameState {
  id: string;
  sport: string;
  title: string;
  venue: string;
  dateString: string;
  isLive: boolean;
  statusText: string;
  quarter: string;
  clock: string;
  homeTeam: TeamData;
  awayTeam: TeamData;
  possession: 'home' | 'away';
  down: string;
  distance: string;
  ballOn: string;
  redZone: boolean;
  lastPlay: string;
  plays: PlayEvent[];
  socialClips?: SocialClip[];
  updatedAt?: string;
}
