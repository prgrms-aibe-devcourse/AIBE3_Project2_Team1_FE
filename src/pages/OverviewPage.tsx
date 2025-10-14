import { useParams, useSearchParams, Navigate } from 'react-router-dom'; // URL 파라미터/쿼리 사용

import OverView from '@/features/milestone/OverView.tsx';

export default function OverviewPage() {
  // 1) /overview/:milestoneId 형태일 때 파라미터 추출
  const { milestoneId } = useParams<{ milestoneId?: string }>();

  // 2) /overview?milestoneId=123 형태도 허용하려면(옵션)
  const [sp] = useSearchParams();
  const qId = sp.get('milestoneId');

  // 3) 우선순위: path 파라미터 → 쿼리스트링
  const idStr = milestoneId ?? qId ?? undefined;

  // 4) id 없으면 마이페이지 등으로 내보내기(또는 null 반환)
  if (!idStr) return <Navigate to="/mypage" replace />;

  // 5) 숫자로 변환
  const idNum = Number(idStr);
  if (!Number.isFinite(idNum)) return <Navigate to="/mypage" replace />;

  // 6) 개요 뷰에 필수 props 전달
  return <OverView milestoneId={idNum} />;
}
