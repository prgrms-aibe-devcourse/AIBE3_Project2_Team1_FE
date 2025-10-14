import { useParams } from 'react-router-dom';
import CategoryFilter from '../features/project/CategoryFilter';

export default function ProjectList() {
  const { groupId, categoryId } = useParams<{ groupId: string; categoryId?: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryFilter initialGroup={groupId || 'client'} initialCategory={categoryId || 'all'} />
    </div>
  );
}
