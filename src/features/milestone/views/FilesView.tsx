import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import {
  Upload,
  X,
  Trash2,
  Download,
  Search,
  Grid2x2,
  List,
  CheckSquare,
  Square,
  File,
  Image,
  Film,
  Music,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { filesApi, type FileResponseDto } from '../api/milestoneApi';

/* ===== Design Tokens ===== */
const PRIMARY = '#1ABC9C';
const TEXT = '#2C2C2C';
const BORDER = '#E5E7EB';
const BG_SOFT = '#F6EFEF';

/* ===== Types ===== */
type FileItem = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: number;
};
type SortKey = 'name' | 'size' | 'createdAt';

/* ===== Utils ===== */
const formatBytes = (b: number) => {
  if (b === 0) return '0 B';
  const k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
};
const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();

function fileKindIcon(mime?: string, name?: string) {
  const m = mime || '';
  const nm = name || '';
  if (m.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (m.startsWith('video/')) return <Film className="w-4 h-4" />;
  if (m.startsWith('audio/')) return <Music className="w-4 h-4" />;
  if (m === 'application/pdf') return <FileText className="w-4 h-4" />;
  const ext = extOf(nm);
  if (['txt', 'md', 'csv', 'json', 'log'].includes(ext)) return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

/* ===== Main ===== */
export default function FilesView({
  milestoneId = 1,
  refreshTick,
  onChanged,
}: {
  milestoneId?: number;
  refreshTick?: number;
  onChanged?: () => void;
}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const etagRef = useRef<string | undefined>(undefined); // [ADDED]

  const fetchFiles = useCallback(async () => {
    try {
      const res = await filesApi.listConditional(milestoneId, etagRef.current);
      if (res.status === 200 && Array.isArray(res.data)) {
        const list = res.data as FileResponseDto[];
        const items = list.map((f: FileResponseDto) => {
          const id = String(f.fileId ?? f.id);
          return {
            id,
            name: f.name ?? `file-${id}`,
            url:
              f.downloadUrl ??
              (typeof filesApi.getDownloadUrl === 'function'
                ? filesApi.getDownloadUrl(Number(f.fileId ?? f.id))
                : '#'),
            size: Number.isFinite(f.size as number) ? (f.size as number) : 0,
            type: f.type ?? 'application/octet-stream',
            createdAt: isNaN(Date.parse(f.createdAt as string))
              ? Date.now()
              : Date.parse(f.createdAt as string),
          };
        });

        setFiles(items);
        etagRef.current = res.etag ?? etagRef.current;
      } // 304면 무시
    } catch (e) {
      console.error('파일 조회 실패:', e);
    }
  }, [milestoneId]);

  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);
  useEffect(() => {
    if (refreshTick !== undefined) void fetchFiles();
  }, [refreshTick, fetchFiles]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const [showFileModal, setShowFileModal] = useState(false);
  const [showPreview, setShowPreview] = useState<FileItem | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  //키보드 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelected(new Set(files.map((f) => f.id)));
      }
      if (e.key === 'Escape') {
        setSelected(new Set());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [files]);

  // 정렬/ 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files.slice();
    arr.sort((a, b) => {
      let v = 0;
      if (sortKey === 'name') v = a.name.localeCompare(b.name);
      if (sortKey === 'size') v = a.size - b.size;
      if (sortKey === 'createdAt') v = a.createdAt - b.createdAt;
      return sortAsc ? v : -v;
    });
    return arr;
  }, [files, query, sortKey, sortAsc]);

  const allSelected = selected.size > 0 && filtered.every((f) => selected.has(f.id));

  const toggleOne = useCallback((id: string, multi = false, rangeIds?: string[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (rangeIds && rangeIds.length) {
        rangeIds.forEach((rid) => {
          if (next.has(rid)) {
            next.delete(rid);
          } else {
            next.add(rid);
          }
        });
        return next;
      }
      if (multi) {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      } else {
        if (next.size === 1 && next.has(id)) {
          next.clear();
        } else {
          next.clear();
          next.add(id);
        }
      }
      return next;
    });
  }, []);

  const clearSelection = () => setSelected(new Set());
  const selectAll = () => setSelected(new Set(filtered.map((f) => f.id)));

  // 파일 업로드
  const uploadFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        console.log(' 업로드할 파일 없음');
        return;
      }

      const filesArr = Array.from(fileList);

      if (filesArr.length > 10) {
        alert('최대 10개까지 업로드 가능합니다.');
        return;
      }

      for (const f of filesArr) {
        if (f.size > 10 * 1024 * 1024) {
          alert(`파일 크기는 10MB를 초과할 수 없습니다: ${f.name}`);
          return;
        }
      }

      try {
        console.log(' 파일 업로드 시작:', filesArr.length, '개');

        // 한 번에 하나씩 업로드
        for (const file of filesArr) {
          console.log('업로드 중:', file.name);

          const formData = new FormData();
          formData.append('file', file);

          // 백엔드로 전송 (백엔드가 S3 업로드 + DB 저장!)
          const res = await fetch(`/api/v1/milestones/${milestoneId}/files`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`업로드 실패: ${res.status} ${text}`);
          }

          const dto: FileResponseDto = await res.json();
          console.log(' 업로드 완료:', dto);
        }

        // 업로드 완료 후 목록 새로고침
        await fetchFiles();
        setShowFileModal(false);

        console.log(' 전체 업로드 완료:', filesArr.length, '개');
        alert(`${filesArr.length}개 파일 업로드 완료!`);
        onChanged?.();
      } catch (e) {
        console.error('파일 업로드 실패:', e);
        alert(`업로드 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
      }
    },
    [milestoneId, fetchFiles, onChanged]
  );

  // 파일 삭제
  const onDelete = useCallback(
    async (ids: string | string[]) => {
      const delIds = Array.isArray(ids) ? ids : [ids];
      const targets = files.filter((f) => delIds.includes(f.id));

      if (targets.length === 0) return;

      const confirm = window.confirm(`정말 ${targets.length}개 파일을 삭제하시겠습니까?`);
      if (!confirm) return;

      try {
        console.log('🗑️ 파일 삭제 시작:', targets.length, '개');

        for (const f of targets) {
          console.log('🗑️ 삭제 중:', f.name);
          // 백엔드 API 호출 (S3 삭제 + DB 삭제 자동!)
          await filesApi.remove(milestoneId, Number(f.id));
          console.log('✅ 삭제 완료:', f.name);
        }

        setFiles((prev) => prev.filter((f) => !delIds.includes(f.id)));
        setSelected(new Set());

        console.log('✅ 전체 삭제 완료:', targets.length, '개');
        alert(`${targets.length}개 파일 삭제 완료!`);
        onChanged?.();
      } catch (e) {
        console.error('❌ 파일 삭제 실패:', e);
        alert(`삭제 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
      }
    },
    [files, milestoneId, onChanged]
  );

  const onChangeSortKey = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortKey(e.target.value as SortKey);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: TEXT }}>
          파일 관리
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="파일 이름 검색"
              className="pl-7 pr-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ borderColor: BORDER, color: TEXT }}
            />
          </div>

          <div className="flex items-center gap-1">
            <select
              value={sortKey}
              onChange={onChangeSortKey}
              className="px-2 py-2 text-sm rounded-md border"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              <option value="createdAt">업로드일</option>
              <option value="name">이름</option>
              <option value="size">크기</option>
            </select>
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="p-2 rounded-md border"
              style={{ borderColor: BORDER }}
              aria-label="정렬 방향 전환"
            >
              {sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md border ${viewMode === 'grid' ? 'bg-gray-50' : ''}`}
              style={{ borderColor: BORDER }}
              aria-label="그리드 보기"
            >
              <Grid2x2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-50' : ''}`}
              style={{ borderColor: BORDER }}
              aria-label="리스트 보기"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFileModal(true)}
            className="px-3 py-2 text-sm rounded-md text-white"
            style={{ background: PRIMARY }}
          >
            파일 추가
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => {
              if (allSelected) {
                clearSelection();
              } else {
                selectAll();
              }
            }}
            className="px-2 py-1 rounded border hover:bg-gray-50 flex items-center gap-1"
            style={{ borderColor: BORDER }}
          >
            {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>

          {selected.size > 0 ? (
            <>
              <span className="text-gray-500">{selected.size}개 선택됨</span>
              <button
                onClick={() => onDelete(Array.from(selected))}
                className="px-2 py-1 rounded border hover:bg-gray-50 flex items-center gap-1 text-red-600"
                style={{ borderColor: BORDER }}
              >
                <Trash2 className="w-4 h-4" /> 선택 삭제
              </button>
            </>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onUpload={() => setShowFileModal(true)} />
      ) : viewMode === 'grid' ? (
        <GridView
          files={filtered}
          selected={selected}
          onToggle={toggleOne}
          onPreview={setShowPreview}
          onDelete={(id) => onDelete(id)}
        />
      ) : (
        <ListView
          files={filtered}
          selected={selected}
          onToggle={toggleOne}
          onPreview={setShowPreview}
          onDelete={(id) => onDelete(id)}
        />
      )}

      {showFileModal && (
        <FileModal onClose={() => setShowFileModal(false)} onUpload={uploadFiles} />
      )}
      {showPreview && <PreviewModal file={showPreview} onClose={() => setShowPreview(null)} />}
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="rounded-lg border p-10 text-center" style={{ borderColor: BORDER }}>
      <div
        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
        style={{ background: BG_SOFT }}
      >
        <Upload />
      </div>
      <p className="text-sm text-gray-500 mb-4">아직 파일이 없습니다. 파일을 업로드해보세요.</p>
      <button
        onClick={onUpload}
        className="px-3 py-2 text-sm rounded-md text-white"
        style={{ background: PRIMARY }}
      >
        업로드
      </button>
    </div>
  );
}

type CommonViewProps = {
  files: FileItem[];
  selected: Set<string>;
  onToggle: (id: string, multi?: boolean, rangeIds?: string[]) => void;
  onPreview: (f: FileItem) => void;
  onDelete: (id: string) => void;
};

function GridView(props: CommonViewProps) {
  const { files, onDelete, onToggle, selected } = props;

  const lastClicked = useRef<number | null>(null);
  const handleItemClick = (idx: number, e: React.MouseEvent) => {
    const f = files[idx];
    if (!f) return;

    if (e.shiftKey && lastClicked.current !== null) {
      const [s, eIdx] = [lastClicked.current, idx].sort((a, b) => a - b);
      const rangeIds = files.slice(s, eIdx + 1).map((ff) => ff.id);
      onToggle(f.id, true, rangeIds);
    } else {
      onToggle(f.id, e.ctrlKey || e.metaKey);
      lastClicked.current = idx;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {files.map((f, idx) => {
        const isSel = selected.has(f.id);
        return (
          <div
            key={f.id}
            tabIndex={0}
            onClick={(e) => handleItemClick(idx, e)}
            className={`rounded-lg border p-3 flex flex-col gap-3 hover:shadow-sm transition outline-offset-2 ${isSel ? 'ring-2 ring-teal-500' : ''}`}
            style={{ borderColor: BORDER }}
          >
            {f.type?.startsWith('image/') && f.url && (
              <img
                src={f.url}
                alt={f.name}
                className="aspect-video w-full object-cover rounded border"
                style={{ borderColor: BORDER }}
                loading="lazy"
              />
            )}
            <div className="flex items-center gap-2">
              <a
                href={f.url}
                download={f.name}
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                style={{ borderColor: BORDER }}
              >
                <Download className="w-3.5 h-3.5" /> 다운로드
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(f.id);
                }}
                className="ml-auto px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                style={{ borderColor: BORDER }}
              >
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView(props: CommonViewProps) {
  const { files, onDelete, onToggle, selected } = props;

  const lastClicked = useRef<number | null>(null);
  const handleRowClick = (idx: number, e: React.MouseEvent) => {
    const f = files[idx];
    if (!f) return;

    if (e.shiftKey && lastClicked.current !== null) {
      const [s, eIdx] = [lastClicked.current, idx].sort((a, b) => a - b);
      const rangeIds = files.slice(s, eIdx + 1).map((ff) => ff.id);
      onToggle(f.id, true, rangeIds);
    } else {
      onToggle(f.id, e.ctrlKey || e.metaKey);
      lastClicked.current = idx;
    }
  };

  return (
    <div className="rounded-lg border overflow-x-auto" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-3 py-2">파일</th>
            <th className="px-3 py-2">크기</th>
            <th className="px-3 py-2">업로드일</th>
            <th className="px-3 py-2 text-right">작업</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f, idx) => {
            const isSel = selected.has(f.id);
            return (
              <tr
                key={f.id}
                onClick={(e) => handleRowClick(idx, e)}
                className={`border-t cursor-default ${isSel ? 'bg-teal-50/40' : ''}`}
                style={{ borderColor: BORDER }}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {fileKindIcon(f.type, f.name)}
                    <div className="min-w-0">
                      <span className="font-medium truncate">{f.name}</span>
                      <span className="ml-2 text-xs text-gray-500">.{extOf(f.name)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">{formatBytes(f.size)}</td>
                <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 justify-end">
                    <a
                      href={f.url}
                      download={f.name}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                      style={{ borderColor: BORDER }}
                    >
                      <Download className="w-3.5 h-3.5" /> 다운로드
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(f.id);
                      }}
                      className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                      style={{ borderColor: BORDER }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FileModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (files: FileList | null) => Promise<void>;
}) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      await onUpload(fileList);
    },
    [onUpload]
  );

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    };
    const onDragLeave = () => setDragOver(false);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer?.files || null);
    };
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, [handleFiles]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" style={{ color: TEXT }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold">파일 추가</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X />
          </button>
        </div>

        <div
          ref={dropRef}
          className={`flex items-center gap-3 border border-dashed rounded-lg p-4 ${dragOver ? 'bg-gray-50' : ''}`}
          style={{ borderColor: BORDER }}
        >
          <Upload />
          <input
            ref={uploadRef}
            type="file"
            multiple
            accept="image/*"
            className="flex-1 text-sm"
            onChange={(e) => {
              void handleFiles(e.target.files);
            }}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-3 py-2 text-sm rounded-md"
            style={{ background: '#F3F4F6', color: TEXT }}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-3 py-2 text-sm rounded-md text-white"
            style={{ background: PRIMARY }}
            onClick={() => {
              void handleFiles(uploadRef.current?.files || null);
            }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const { url, name, type } = file;

  const ext = extOf(name);
  const isImage = type.startsWith('image/');
  const isVideo = type.startsWith('video/');
  const isAudio = type.startsWith('audio/');
  const isPdf = type === 'application/pdf';
  const isText = ['txt', 'md', 'csv', 'json', 'log'].includes(ext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {fileKindIcon(type, name)}
            <div className="truncate font-medium">{name}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto">
          {isImage && <img src={url} alt={name} className="max-h-[65vh] mx-auto object-contain" />}
          {isVideo && <video src={url} controls className="w-full max-h-[65vh]" />}
          {isAudio && <audio src={url} controls className="w-full" />}
          {isPdf && <iframe title={name} src={url} className="w-full h-[65vh]" />}
          {isText && <iframe title={name} src={url} className="w-full h-[65vh]" />}
          {!isImage && !isVideo && !isAudio && !isPdf && !isText && (
            <div className="text-sm text-gray-500 text-center py-10">
              미리보기를 지원하지 않는 파일 형식입니다. 다운로드하여 확인하세요.
            </div>
          )}
        </div>

        <div
          className="px-4 py-3 border-t flex items-center justify-end gap-2"
          style={{ borderColor: BORDER }}
        >
          <a
            href={url}
            download={name}
            className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50 flex items-center gap-1"
            style={{ borderColor: BORDER }}
          >
            <Download className="w-4 h-4" /> 다운로드
          </a>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-md"
            style={{ background: '#F3F4F6', color: TEXT }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
