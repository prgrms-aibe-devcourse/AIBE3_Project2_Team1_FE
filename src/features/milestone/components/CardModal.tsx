import { useState } from 'react';
import { Check } from 'lucide-react';

interface CardModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (title: string) => void;
  onDelete: () => void;
}
interface Column {
  id: string;
  title: string;
  color: string;
}

interface ColumnModalProps {
  isOpen: boolean;
  column: Column | null;
  onClose: () => void;
  onSave: (title: string, color: string) => void;
  onDelete: () => void;
}

const AVAILABLE_COLORS = [
  { value: 'bg-sky-50', label: '하늘색' },
  { value: 'bg-amber-50', label: '호박색' },
  { value: 'bg-orange-50', label: '주황색' },
  { value: 'bg-emerald-50', label: '에메랄드색' },
  { value: 'bg-zinc-50', label: '회색' },
];

export function CardModal({ isOpen, title, onClose, onSave, onDelete }: CardModalProps) {
  const [editedTitle, setEditedTitle] = useState(title);

  if (!isOpen) return null;

  const handleSave = () => {
    if (editedTitle.trim()) {
      onSave(editedTitle);
      onClose();
    }
  };
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">카드 편집</h2>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="카드 제목"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: '#666666' }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// 컬럼 편집 모달
export function ColumnModal({ isOpen, column, onClose, onSave, onDelete }: ColumnModalProps) {
  const [editedTitle, setEditedTitle] = useState(column?.title || '');
  const [selectedColor, setSelectedColor] = useState(column?.color || 'bg-sky-50');

  if (!isOpen || !column) return null;

  const handleSave = () => {
    if (editedTitle.trim()) {
      onSave(editedTitle, selectedColor);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">컬럼 편집</h2>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="컬럼 제목"
          autoFocus
        />
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">색상</label>
          <div className="flex gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex-1 h-10 rounded-lg border-2 ${color.value} ${
                  selectedColor === color.value ? 'ring-2 ring-offset-2' : 'border-gray-200'
                } hover:border-teal-400 transition-all relative`}
                style={
                  selectedColor === color.value
                    ? ({
                        borderColor: '#1ABC9C',
                        '--tw-ring-color': '#1ABC9C',
                      } as React.CSSProperties)
                    : {}
                }
              >
                {selectedColor === color.value && (
                  <Check
                    className="absolute inset-0 m-auto w-5 h-5"
                    style={{ color: '#1ABC9C' }}
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg transition-all"
            style={{ color: '#FF6B6B' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium"
            style={{ backgroundColor: '#666666' }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
