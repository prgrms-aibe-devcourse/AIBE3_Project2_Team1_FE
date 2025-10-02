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
  Eye,
  Pencil,
} from 'lucide-react';

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
const id = () => Math.random().toString(36).slice(2, 10);
const formatBytes = (b: number) => {
  if (b === 0) return '0 B';
  const k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
};
const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();

function fileKindIcon(mime: string, name: string) {
  if (mime.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (mime.startsWith('video/')) return <Film className="w-4 h-4" />;
  if (mime.startsWith('audio/')) return <Music className="w-4 h-4" />;
  if (mime === 'application/pdf') return <FileText className="w-4 h-4" />;
  const ext = extOf(name);
  if (['txt', 'md', 'csv', 'json', 'log'].includes(ext)) return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

/* ===== Main ===== */
export default function FilesView() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const [showFileModal, setShowFileModal] = useState(false);
  const [showPreview, setShowPreview] = useState<FileItem | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelected(new Set(files.map((f) => f.id)));
      }
      if (e.key === 'Escape') {
        setSelected(new Set());
        setRenameId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [files]);

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

  const onDelete = useCallback((ids: string | string[]) => {
    const delIds = Array.isArray(ids) ? ids : [ids];
    setFiles((prev) => prev.filter((p) => !delIds.includes(p.id)));
    setSelected(new Set());
  }, []);

  const startRename = (f: FileItem) => {
    setRenameId(f.id);
    setRenameValue(f.name);
  };
  const commitRename = () => {
    if (!renameId) return;
    const newName = renameValue.trim();
    if (!newName) {
      setRenameId(null);
      return;
    }
    setFiles((prev) => prev.map((f) => (f.id === renameId ? { ...f, name: newName } : f)));
    setRenameId(null);
  };

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
          onStartRename={startRename}
          renameId={renameId}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onCommitRename={commitRename}
        />
      ) : (
        <ListView
          files={filtered}
          selected={selected}
          onToggle={toggleOne}
          onPreview={setShowPreview}
          onDelete={(id) => onDelete(id)}
          onStartRename={startRename}
          renameId={renameId}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onCommitRename={commitRename}
        />
      )}

      {showFileModal && (
        <FileModal
          onClose={() => setShowFileModal(false)}
          onUpload={(items) => setFiles((prev) => [...items, ...prev])}
        />
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
  onStartRename: (f: FileItem) => void;
  renameId: string | null;
  renameValue: string;
  setRenameValue: (v: string) => void;
  onCommitRename: () => void;
};

function GridView(props: CommonViewProps) {
  const {
    files,
    onPreview,
    onDelete,
    onToggle,
    selected,
    onStartRename,
    renameId,
    renameValue,
    setRenameValue,
    onCommitRename,
  } = props;

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
        const isRenaming = renameId === f.id;
        return (
          <div
            key={f.id}
            tabIndex={0}
            onClick={(e) => handleItemClick(idx, e)}
            className={`rounded-lg border p-3 flex flex-col gap-3 hover:shadow-sm transition outline-offset-2 ${isSel ? 'ring-2 ring-teal-500' : ''}`}
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center gap-2">
              {fileKindIcon(f.type, f.name)}
              <div className="min-w-0 flex-1">
                {isRenaming ? (
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(e) => e.key === 'Enter' && onCommitRename()}
                    autoFocus
                    className="w-full px-1 py-0.5 rounded border focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ borderColor: BORDER }}
                  />
                ) : (
                  <div className="font-medium truncate">{f.name}</div>
                )}
                <div className="text-xs text-gray-500">
                  {formatBytes(f.size)} · {new Date(f.createdAt).toLocaleDateString()}
                </div>
              </div>
              {!isRenaming && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRename(f);
                  }}
                  className="p-1 rounded border hover:bg-gray-50"
                  style={{ borderColor: BORDER }}
                  title="이름 변경"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {f.type.startsWith('image/') && (
              <img
                src={f.url}
                alt={f.name}
                className="aspect-video w-full object-cover rounded border"
                style={{ borderColor: BORDER }}
                loading="lazy"
              />
            )}

            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(f);
                }}
                className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                style={{ borderColor: BORDER }}
              >
                <Eye className="w-3.5 h-3.5" /> 미리보기
              </button>
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
  const {
    files,
    onPreview,
    onDelete,
    onToggle,
    selected,
    onStartRename,
    renameId,
    renameValue,
    setRenameValue,
    onCommitRename,
  } = props;

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
            const isRenaming = renameId === f.id;
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
                      {isRenaming ? (
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={onCommitRename}
                          onKeyDown={(e) => e.key === 'Enter' && onCommitRename()}
                          autoFocus
                          className="px-1 py-0.5 rounded border focus:outline-none focus:ring-2 focus:ring-teal-500"
                          style={{ borderColor: BORDER }}
                        />
                      ) : (
                        <span className="font-medium truncate">{f.name}</span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">.{extOf(f.name)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">{formatBytes(f.size)}</td>
                <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 justify-end">
                    {!isRenaming && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartRename(f);
                        }}
                        className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                        style={{ borderColor: BORDER }}
                      >
                        <Pencil className="w-3.5 h-3.5" /> 이름 변경
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(f);
                      }}
                      className="px-2 py-1 rounded border text-xs hover:bg-gray-50 flex items-center gap-1"
                      style={{ borderColor: BORDER }}
                    >
                      <Eye className="w-3.5 h-3.5" /> 미리보기
                    </button>
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
  onUpload: (items: FileItem[]) => void;
}) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const arr = Array.from(fileList);
      const items: FileItem[] = arr.map((file) => ({
        id: id(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type || 'application/octet-stream',
        createdAt: Date.now(),
      }));
      onUpload(items);
      onClose();
    },
    [onUpload, onClose]
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
            className="flex-1 text-sm"
            onChange={(e) => handleFiles(e.target.files)}
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
            onClick={() => handleFiles(uploadRef.current?.files || null)}
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
