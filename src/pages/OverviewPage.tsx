// src/pages/OverviewPage.tsx
import { useParams, useSearchParams } from 'react-router-dom'; // [CHANGED] Navigate 제거
import OverView from '@/features/milestone/OverView.tsx';

// 목적: id가 없어도 동작(기본 마일스톤 사용). 있으면 해당 id로 표시.
export default function OverviewPage() {
  // (선택) /overview/:milestoneId 라우트도 쓸 수 있게 유지하고 싶다면 사용
  const { milestoneId } = useParams<{ milestoneId?: string }>();
  const [sp] = useSearchParams();
  const qId = sp.get('milestoneId');

  // 우선순위: path 파라미터 > 쿼리스트링. 둘 다 없으면 undefined 전달
  const idStr = milestoneId ?? qId ?? undefined;

  // 숫자로 변환; 숫자가 아니면 undefined로 처리해서 기본값 사용
  const idNum = idStr && Number.isFinite(Number(idStr)) ? Number(idStr) : undefined; // [CHANGED]

  // [CHANGED] 더 이상 /mypage로 리다이렉트하지 않음.
  //           idNum이 undefined여도 OverView가 .env의 VITE_DEFAULT_MILESTONE_ID(없으면 1)로 동작.
  return <OverView milestoneId={idNum} />;
}
