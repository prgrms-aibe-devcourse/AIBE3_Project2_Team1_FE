import axiosInstance from '../../../services/axios.ts';

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
  id: number;
  name: string;
  role: string;
  imageUrl?: string | null;
}
//ETag 조건부 GET 유틸
async function getWithEtag<T>(url: string, etag?: string) {
  const { data, status, headers } = await axiosInstance.get<T>(url, {
    // 200(변경됨), 304(변경없음)만 성공으로 간주
    validateStatus: (s) => s === 200 || s === 304,
    headers: etag ? { 'If-None-Match': etag } : undefined,
  });
  return { status, data: data as T, etag: headers?.etag as string | undefined };
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
  // [ADD] ETag 조건부 GET
  async listConditional(milestoneId: number, etag?: string) {
    return getWithEtag<KanbanCardResponse[]>(`${BASE}/${milestoneId}/cards`, etag);
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
  // [ADD] ETag 조건부 GET
  async listConditional(milestoneId: number, etag?: string) {
    return getWithEtag<CalendarEventResponse[]>(`${BASE}/${milestoneId}/cards`, etag);
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
  // [ADD] ETag 조건부 GET
  async listConditional(milestoneId: number, etag?: string) {
    return getWithEtag<FileResponseDto[]>(`${BASE}/${milestoneId}/cards`, etag);
  },

  // POST /api/v1/milestones/{milestoneId}/files  (multipart)
  async upload(milestoneId: number, file: File): Promise<FileResponseDto> {
    const form = new FormData();
    form.append('file', file); // 서버 @RequestParam("file") 이름과 일치해야 함

    const { data } = await axiosInstance.post<FileResponseDto>(
      `${BASE}/${milestoneId}/files`,
      form as FormData
    );

    return data;
  },

  // 여러 개 업로드: 단일 업로드를 반복 호출(순차)
  async uploadManySequential(milestoneId: number, files: File[]): Promise<FileResponseDto[]> {
    const results: FileResponseDto[] = [];
    for (const f of files) {
      const dto = await filesApi.upload(milestoneId, f);
      results.push(dto);
    }
    return results;
  },

  // DELETE /api/v1/milestones/{milestoneId}/files/{fileId}
  async remove(milestoneId: number, fileId: number) {
    await axiosInstance.delete<void>(`${BASE}/${milestoneId}/files/${fileId}`);
  },

  // 파일 다운로드 URL 생성 (다운로드는 브라우저 navigation로 처리)
  getDownloadUrl(fileId: number) {
    return `/milestones/files/download/${fileId}`;
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
