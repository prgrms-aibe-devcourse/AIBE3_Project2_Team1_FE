export type TabKey = 'request' | 'in-progress' | 'completed' | 'freelancer' | 'review';

export interface RequestItem {
  id: number;
  title: string;
}

export interface ProjectItem {
  id: number;
  image: string;
  title: string;
}

export interface FreelancerItem {
  id: number;
  image: string;
  name: string;
  info: string;
}

export interface ReviewItem {
  id: number;
  image: string;
  title: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  bio?: string;
  completedCount: number;
  inProgressCount: number;
}
