export type DashboardTabKey =
  | 'in-progress'
  | 'request'
  | 'completed'
  | 'review'
  | 'bookmark'
  | 'proposal';

export interface RequestItem {
  id: number;
  title: string;
}

export interface ProjectItem {
  id: number;
  image: string;
  title: string;
}

export interface ReviewItem {
  id: number;
  image: string;
  title: string;
}

export interface BookmarkItem {
  id: number;
  image: string;
  title: string;
}

export interface ProposalItem {
  id: number;
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
export interface ReviewTab {
  tab: 'review';
  reviews: ReviewItem[];
}

export interface ProposalTab {
  tab: 'proposal';
  proposals: ProposalItem[];
}

export interface BookmarkTab {
  tab: 'bookmark';
  bookmarks: BookmarkItem[];
}
export type DashboardTabData =
  | InProgressTab
  | RequestTab
  | CompletedTab
  | ReviewTab
  | BookmarkTab
  | ProposalTab;
