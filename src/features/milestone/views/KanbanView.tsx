import { useState } from 'react';
import { Pencil } from 'lucide-react';
import KanbanCard from '../components/KanbanCard';
import { CardModal, ColumnModal } from '../components/CardModal';

interface Card {
  id: string;
  title: string;
  columnId: string;
}
interface Column {
  id: string;
  title: string;
  color: string;
}

export default function KanbanView() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'planned', title: '계획중', color: 'bg-sky-50' },
    { id: 'doing', title: '진행중', color: 'bg-amber-50' },
    { id: 'testing', title: '테스트중', color: 'bg-orange-50' },
    { id: 'done', title: '완료됨', color: 'bg-emerald-50' },
    { id: 'onhold', title: '보류중', color: 'bg-zinc-50' },
  ]);

  const [cards, setCards] = useState<Card[]>([
    { id: '1', title: '첫 번째 카드', columnId: 'planned' },
  ]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  const addCard = (columnId: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      title: '새 카드',
      columnId,
    };
    setCards([...cards, newCard]);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: '새 컬럼',
      color: 'bg-sky-50',
    };
    setColumns([...columns, newColumn]);
  };

  const updateCard = (cardId: string, newTitle: string) => {
    setCards(cards.map((card) => (card.id === cardId ? { ...card, title: newTitle } : card)));
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const updateColumn = (columnId: string, newTitle: string, newColor: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle, color: newColor } : col
      )
    );
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setCards(cards.filter((card) => card.columnId !== columnId));
  };

  const getColumnCards = (columnId: string) => {
    return cards.filter((card) => card.columnId === columnId);
  };

  const handleDragStart = (e: React.DragEvent, card: Card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedCard && draggedCard.columnId !== columnId) {
      setCards(cards.map((card) => (card.id === draggedCard.id ? { ...card, columnId } : card)));
    }
    setDraggedCard(null);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72 flex flex-col">
            <div
              className={`rounded-t-2xl px-4 py-3 ${column.color} border-t border-l border-r border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
                <button
                  onClick={() => setSelectedColumn(column)}
                  className="p-1.5 hover:bg-white rounded-lg transition-all"
                  style={{ color: '#666666' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  title="컬럼 편집"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 bg-white/50 backdrop-blur-sm border-l border-r border-gray-200 p-3"
              style={{ minHeight: '300px' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="space-y-2.5">
                {getColumnCards(column.id).map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    className="cursor-move active:opacity-50 active:scale-95 transition-all"
                  >
                    <KanbanCard title={card.title} onClick={() => setSelectedCard(card)} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => addCard(column.id)}
              className="rounded-b-2xl px-4 py-3 bg-white text-gray-500 hover:bg-gray-50 border-b border-l border-r border-gray-200 flex items-center justify-center gap-2 transition-all"
              style={{ color: '#1ABC9C' }}
            >
              <span className="text-base font-light">+</span>
              <span className="text-sm">카드 추가</span>
            </button>
          </div>
        ))}

        {/* 컬럼 추가 버튼을 마지막에 배치 */}
        <div className="flex-shrink-0 flex items-start pt-3">
          <button
            onClick={addColumn}
            className="w-12 h-12 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center border border-gray-200"
            style={{ color: '#1ABC9C' }}
            title="컬럼 추가"
          >
            <span className="text-2xl font-light">+</span>
          </button>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          isOpen={true}
          title={selectedCard.title}
          onClose={() => setSelectedCard(null)}
          onSave={(newTitle) => updateCard(selectedCard.id, newTitle)}
          onDelete={() => deleteCard(selectedCard.id)}
        />
      )}

      {selectedColumn && (
        <ColumnModal
          isOpen={true}
          column={selectedColumn}
          onClose={() => setSelectedColumn(null)}
          onSave={(newTitle, newColor) => updateColumn(selectedColumn.id, newTitle, newColor)}
          onDelete={() => deleteColumn(selectedColumn.id)}
        />
      )}
    </div>
  );
}
