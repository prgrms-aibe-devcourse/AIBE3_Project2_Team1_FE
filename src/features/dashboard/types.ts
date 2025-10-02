export type DashboardTabKey = 'in-progress' | 'request' | 'completed' | 'freelancer' | 'review';

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

export interface DashboardSummaryData {
  ongoingCount: number;
  requestCount: number;
  completedCount: number;
  favoriteFreelancersCount: number;
  reviewCount: number;
}
export interface InProgressTab {
  tab: 'in-progress';
  projects: ProjectItem[];
}
export interface RequestTab {
  tab: 'request';
  requests: RequestItem[];
}
export interface CompletedTab {
  tab: 'completed';
  projects: ProjectItem[];
}
export interface FreelancerTab {
  tab: 'freelancer';
  freelancers: FreelancerItem[];
}
export interface ReviewTab {
  tab: 'review';
  reviews: ReviewItem[];
}

export type DashboardTabData =
  | InProgressTab
  | RequestTab
  | CompletedTab
  | FreelancerTab
  | ReviewTab;
