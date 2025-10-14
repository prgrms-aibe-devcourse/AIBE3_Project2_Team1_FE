export type Mode = 'client' | 'freelancer';

export interface ProfileCardProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  name?: string;
  email?: string;
  description?: string;
  skills?: string;
  completedCount?: number;
  inProgressCount?: number;
  profileImgUrl?: string | null;
}

export interface ProfileInfo {
  name: string;
  email: string;
  description?: string;
  skills?: string;
  completedCount: number;
  inProgressCount: number;
  mode: Mode;
}
