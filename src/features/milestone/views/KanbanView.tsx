import { useState } from 'react';
import KanbanCard from '../components/KanbanCard';
import CardModal from '../components/CardModal.tsx';

interface Card {
  id: string;
  title: string;
  columnId: string;
}

const COLUMNS = [
  { id: 'planned', title: '계획중', color: 'bg-sky-50' },
  { id: 'doing', title: '진행중', color: 'bg-amber-50' },
  { id: 'testing', title: '테스트중', color: 'bg-orange-50' },
  { id: 'done', title: '완료됨', color: 'bg-emerald-50' },
  { id: 'onhold', title: '보류중', color: 'bg-zinc-50' },
];

export default function KanbanView() {
  const [cards, setCards] = useState<Card[]>([
    { id: '1', title: '첫 번째 카드', columnId: 'planned' },
  ]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const addCard = (columnId: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      title: '새 카드',
      columnId,
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (cardId: string, newTitle: string) => {
    setCards(cards.map((card) => (card.id === cardId ? { ...card, title: newTitle } : card)));
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const getColumnCards = (columnId: string) => {
    return cards.filter((card) => card.columnId === columnId);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className={`rounded-lg p-3 border border-gray-200 ${column.color}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <button
                onClick={() => addCard(column.id)}
                className="px-2 py-1 text-xs bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                + 카드
              </button>
            </div>

            <div className="space-y-2 min-h-[200px]">
              {getColumnCards(column.id).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">카드 없음</p>
              ) : (
                getColumnCards(column.id).map((card) => (
                  <KanbanCard
                    key={card.id}
                    title={card.title}
                    onClick={() => setSelectedCard(card)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
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
    </>
  );
}
