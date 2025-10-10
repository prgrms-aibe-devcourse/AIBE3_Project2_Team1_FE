interface KanbanCardProps {
  title: string;
  onClick: () => void;
}

export default function KanbanCard({ title, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-gray-300 transition-all"
    >
      <p className="text-sm text-gray-700">{title}</p>
    </div>
  );
}
