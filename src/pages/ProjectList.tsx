import { useParams } from 'react-router-dom';
import CategoryFilter from '../features/project/CategoryFilter';

export default function ProjectList() {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryFilter initialGroup={groupId || 'client'} />
    </div>
  );
}
