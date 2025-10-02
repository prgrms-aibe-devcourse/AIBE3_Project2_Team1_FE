export type Mode = 'client' | 'freelancer';

export interface ProfileCardProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  name?: string;
  email?: string;
  bio?: string;
  completedCount?: number;
  inProgressCount?: number;
}

export interface ProfileInfo {
  name: string;
  email: string;
  bio?: string;
  completedCount: number;
  inProgressCount: number;
  mode: Mode;
}
