interface KanbanCardProps {
  title: string;
  onClick: () => void;
}

export default function KanbanCard({ title, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-gray-900">{title}</p>
    </div>
  );
}
