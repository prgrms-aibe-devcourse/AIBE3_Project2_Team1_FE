import { useState } from 'react';

interface CardModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (title: string) => void;
  onDelete: () => void;
}

export default function CardModal({ isOpen, title, onClose, onSave, onDelete }: CardModalProps) {
  const [editedTitle, setEditedTitle] = useState(title);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">카드 편집</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            삭제
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
