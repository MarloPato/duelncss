export interface User {
  id: number;
  username: string;
}

export interface Challenge {
  id: number;
  title: string;
  slug: string;
  target_html: string;
  target_image: string;
  viewport_w: number;
  viewport_h: number;
  palette: string[];
  starter_html: string;
  created_at?: string;
}

export interface ChallengeSummary {
  id: number;
  title: string;
  slug: string;
  target_image: string;
  viewport_w: number;
  viewport_h: number;
  palette: string[];
  created_at: string;
}

export interface Submission {
  id: number;
  score: number;
  char_count: number;
  css_code: string;
  html_code: string;
  submitted_at: string;
}

export interface SubmissionSummary {
  challenge_id: number;
  score: number;
  char_count: number;
}

export interface LeaderboardEntry {
  username: string;
  score?: number;
  char_count?: number;
  total_score?: number;
  challenges_completed?: number;
  submitted_at?: string;
}

export interface ScoreInfo {
  score: number;
  chars: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}
