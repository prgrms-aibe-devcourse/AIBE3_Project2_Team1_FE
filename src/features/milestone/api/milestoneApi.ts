// ===== milestoneApi.ts (프론트 전용 HTTP 래퍼) =====
const BASE = '/api/v1/milestones';

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const body = await res.text();
  return (body ? JSON.parse(body) : undefined) as T;
}
async function formFetch<T>(input: RequestInfo, form: FormData, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { method: 'POST', body: form, credentials: 'include', ...init });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const body = await res.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

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

/* ===== 마일스톤 ===== */
export const milestoneApi = {
  get: (milestoneId: number) =>
    jsonFetch<MilestoneResponseDto>(`${BASE}/${milestoneId}`, { method: 'GET' }),
  update: (milestoneId: number, payload: Partial<MilestoneResponseDto>) =>
    jsonFetch<MilestoneResponseDto>(`${BASE}/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

/* ===== 칸반 ===== */
export const kanbanApi = {
  list: (milestoneId: number) =>
    jsonFetch<KanbanCardResponse[]>(`${BASE}/${milestoneId}/cards`, { method: 'GET' }),
  create: (milestoneId: number, columnId: string, title: string) =>
    jsonFetch<KanbanCardResponse>(`${BASE}/${milestoneId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ title, columnId }),
    }),
  update: (milestoneId: number, cardId: number, patch: CardPatchRequest) =>
    jsonFetch<KanbanCardResponse>(`${BASE}/${milestoneId}/cards/${cardId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  remove: (milestoneId: number, cardId: number) =>
    jsonFetch<void>(`${BASE}/${milestoneId}/cards/${cardId}`, { method: 'DELETE' }),
};

/* ===== 캘린더 ===== */
export const calendarApi = {
  list: (milestoneId: number) =>
    jsonFetch<CalendarEventResponse[]>(`${BASE}/${milestoneId}/events`, { method: 'GET' }),
  create: (milestoneId: number, title: string, date: string) =>
    jsonFetch<CalendarEventResponse>(`${BASE}/${milestoneId}/events`, {
      method: 'POST',
      body: JSON.stringify({ title, date }),
    }),
  update: (milestoneId: number, eventId: number, patch: EventPatchRequest) =>
    jsonFetch<CalendarEventResponse>(`${BASE}/${milestoneId}/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  remove: (milestoneId: number, eventId: number) =>
    jsonFetch<void>(`${BASE}/${milestoneId}/events/${eventId}`, { method: 'DELETE' }),
};

/* ===== 파일 ===== */
export const filesApi = {
  list: (milestoneId: number) =>
    jsonFetch<FileResponseDto[]>(`${BASE}/${milestoneId}/files`, { method: 'GET' }),
  upload: (milestoneId: number, fileList: File[]) => {
    const form = new FormData();
    fileList.forEach((f) => form.append('files', f));
    return formFetch<FileResponseDto[]>(`${BASE}/${milestoneId}/files`, form, { method: 'POST' });
  },
  remove: (milestoneId: number, fileId: number) =>
    jsonFetch<void>(`${BASE}/${milestoneId}/files/${fileId}`, { method: 'DELETE' }),
  getDownloadUrl: (fileId: number) => `/api/v1/milestones/files/download/${fileId}`,
};

/* ===== 팀원(선택) ===== */
export const teamApi = {
  list: (milestoneId: number) =>
    jsonFetch<TeamMemberDto[]>(`${BASE}/${milestoneId}/team-members`, { method: 'GET' }),
  create: (milestoneId: number, payload: Partial<TeamMemberDto>) =>
    jsonFetch<TeamMemberDto>(`${BASE}/${milestoneId}/team-members/one`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (milestoneId: number, memberId: number, payload: Partial<TeamMemberDto>) =>
    jsonFetch<TeamMemberDto>(`${BASE}/${milestoneId}/team-members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (milestoneId: number, memberId: number) =>
    jsonFetch<void>(`${BASE}/${milestoneId}/team-members/${memberId}`, { method: 'DELETE' }),
};
