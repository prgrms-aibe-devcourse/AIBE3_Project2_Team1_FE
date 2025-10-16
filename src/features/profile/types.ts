export type Role = 'client' | 'freelancer';

export interface ProfileCardProps {
  role: Role;
  setRole: (m: Role) => void;
  name?: string;
  email?: string;
  title?: string;
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
  role: Role;
}
