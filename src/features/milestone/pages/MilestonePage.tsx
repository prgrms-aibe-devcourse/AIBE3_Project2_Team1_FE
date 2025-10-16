import OverView from '../OverView.tsx';
import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { milestoneApi } from '@/features/milestone/api/milestoneApi.ts';

export default function MilestonePage() {
  // return <OverView />;
  //  URL에서 milestoneId 추출: /milestone/123 → "123"
  const { milestoneId } = useParams<{ milestoneId: string }>();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // 마운트 시 권한 체크
  useEffect(() => {
    async function checkAccess() {
      if (!milestoneId) {
        console.log('milestoneId 없음');
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        console.log('권한 체크 시작:', milestoneId);

        // 마일스톤 정보 조회 (백엔드에서 권한 체크함)
        await milestoneApi.get(Number(milestoneId));

        console.log('접근 권한 있음');
        setHasAccess(true);
      } catch (e) {
        console.error('접근 권한 없음 또는 마일스톤 없음:', e);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    void checkAccess();
  }, [milestoneId]);

  // 로딩 화면
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">마일스톤 로딩 중...</p>
        </div>
      </div>
    );
  }
  if (!hasAccess || !milestoneId) {
    return <Navigate to="/mypage" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OverView milestoneId={Number(milestoneId)} />
    </div>
  );
}
