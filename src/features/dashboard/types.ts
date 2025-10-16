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
  projectId: number;
  title: string;
  category: string;
  status: string;
  deadline: string;
  imageUrls: string[0];
}

export interface ReviewItem {
  reviewId: number;
  projectId: number;
  projectTitle: string;
  toUserName: string;
  rating: number;
  comment: string;
  imageUrls: string[0];
}

export interface BookmarkItem {
  id: number;
  image: string;
  title: string;
}

export interface ProposalItem {
  id: number;
  title: string;
  status: string;
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
