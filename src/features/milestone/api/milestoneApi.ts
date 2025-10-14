import axiosInstance from '@/services/axios.ts';

const BASE = '/milestones';

/* ===== 타입 ===== */
export interface MilestoneResponseDto {
  milestoneId: number;
  title: string;
  description: string | null;
  dueDate?: string | null;
  milestoneStatus?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}
export interface KanbanCardResponse {
  cardId?: number;
  id?: number;
  title: string;
  columnId: string;
}
export type CardPatchRequest = Partial<Pick<KanbanCardResponse, 'title' | 'columnId'>>;
export interface CalendarEventResponse {
  eventId?: number;
  id?: number;
  title: string;
  date: string;
}
export type EventPatchRequest = Partial<Pick<CalendarEventResponse, 'title' | 'date'>>;
export interface FileResponseDto {
  fileId?: number;
  id?: number;
  name: string;
  size: number;
  type: string;
  downloadUrl: string;
  createdAt: string;
}
export interface TeamMemberDto {
  memberId: number;
  name: string;
  role: string;
  avatarUrl?: string | null;
}

// ===== 마일스톤 =====
export const milestoneApi = {
  // GET /api/v1/milestones/{milestoneId}
  async get(milestoneId: number) {
    const { data } = await axiosInstance.get<MilestoneResponseDto>(`${BASE}/${milestoneId}`);
    return data;
  },

  // PATCH /api/v1/milestones/{milestoneId}  body: { title?, description?, ... }
  async update(milestoneId: number, payload: Partial<MilestoneResponseDto>) {
    const { data } = await axiosInstance.patch<MilestoneResponseDto>(
      `${BASE}/${milestoneId}`,
      payload
    );
    return data;
  },
};

// ===== 칸반 =====
export const kanbanApi = {
  // GET /api/v1/milestones/{milestoneId}/cards
  async list(milestoneId: number) {
    const { data } = await axiosInstance.get<KanbanCardResponse[]>(`${BASE}/${milestoneId}/cards`);
    return data;
  },

  // POST /api/v1/milestones/{milestoneId}/cards  body: { title, columnId }
  async create(milestoneId: number, columnId: string, title: string) {
    const { data } = await axiosInstance.post<KanbanCardResponse>(`${BASE}/${milestoneId}/cards`, {
      title,
      columnId,
    });
    return data;
  },

  // PATCH /api/v1/milestones/{milestoneId}/cards/{cardId}
  async update(milestoneId: number, cardId: number, patch: CardPatchRequest) {
    const { data } = await axiosInstance.patch<KanbanCardResponse>(
      `${BASE}/${milestoneId}/cards/${cardId}`,
      patch
    );
    return data;
  },

  // DELETE /api/v1/milestones/{milestoneId}/cards/{cardId}
  async remove(milestoneId: number, cardId: number) {
    await axiosInstance.delete<void>(`${BASE}/${milestoneId}/cards/${cardId}`);
  },
};

// ===== 캘린더 =====
export const calendarApi = {
  // GET /api/v1/milestones/{milestoneId}/events
  async list(milestoneId: number) {
    const { data } = await axiosInstance.get<CalendarEventResponse[]>(
      `${BASE}/${milestoneId}/events`
    );
    return data;
  },

  // POST /api/v1/milestones/{milestoneId}/events  body: { title, date }
  async create(milestoneId: number, title: string, date: string) {
    const { data } = await axiosInstance.post<CalendarEventResponse>(
      `${BASE}/${milestoneId}/events`,
      {
        title,
        date,
      }
    );
    return data;
  },

  // PATCH /api/v1/milestones/{milestoneId}/events/{eventId}
  async update(milestoneId: number, eventId: number, patch: EventPatchRequest) {
    const { data } = await axiosInstance.patch<CalendarEventResponse>(
      `${BASE}/${milestoneId}/events/${eventId}`,
      patch
    );
    return data;
  },

  // DELETE /api/v1/milestones/{milestoneId}/events/{eventId}
  async remove(milestoneId: number, eventId: number) {
    await axiosInstance.delete<void>(`${BASE}/${milestoneId}/events/${eventId}`);
  },
};

// ===== 파일 =====
export const filesApi = {
  // GET /api/v1/milestones/{milestoneId}/files
  async list(milestoneId: number) {
    const { data } = await axiosInstance.get<FileResponseDto[]>(`${BASE}/${milestoneId}/files`);
    return data;
  },

  // POST /api/v1/milestones/{milestoneId}/files  (multipart)
  async upload(milestoneId: number, fileList: File[]) {
    const form = new FormData();
    fileList.forEach((f) => form.append('files', f));
    // axios는 FormData일 때 Content-Type에 boundary를 자동 세팅하므로 헤더 지정 불필요
    const { data } = await axiosInstance.post<FileResponseDto[]>(
      `${BASE}/${milestoneId}/files`,
      form
    );
    return data;
  },

  // DELETE /api/v1/milestones/{milestoneId}/files/{fileId}
  async remove(milestoneId: number, fileId: number) {
    await axiosInstance.delete<void>(`${BASE}/${milestoneId}/files/${fileId}`);
  },

  // 파일 다운로드 URL 생성 (다운로드는 브라우저 navigation로 처리)
  getDownloadUrl(fileId: number) {
    // axiosInstance.baseURL이 '/api/v1' 이므로, 여기엔 전체 경로를 그대로 사용
    return `/api/v1/milestones/files/download/${fileId}`;
  },
};

// ===== 팀원 =====
export const teamApi = {
  // GET /api/v1/milestones/{milestoneId}/team-members
  async list(milestoneId: number) {
    const { data } = await axiosInstance.get<TeamMemberDto[]>(
      `${BASE}/${milestoneId}/team-members`
    );
    return data;
  },

  // POST /api/v1/milestones/{milestoneId}/team-members/one
  async create(milestoneId: number, payload: Partial<TeamMemberDto>) {
    const { data } = await axiosInstance.post<TeamMemberDto>(
      `${BASE}/${milestoneId}/team-members/one`,
      payload
    );
    return data;
  },

  // PATCH /api/v1/milestones/{milestoneId}/team-members/{memberId}
  async update(milestoneId: number, memberId: number, payload: Partial<TeamMemberDto>) {
    const { data } = await axiosInstance.patch<TeamMemberDto>(
      `${BASE}/${milestoneId}/team-members/${memberId}`,
      payload
    );
    return data;
  },

  // DELETE /api/v1/milestones/{milestoneId}/team-members/{memberId}
  async remove(milestoneId: number, memberId: number) {
    await axiosInstance.delete<void>(`${BASE}/${milestoneId}/team-members/${memberId}`);
  },
};
