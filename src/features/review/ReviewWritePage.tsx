import { useState } from 'react';
import StarRating from '@/components/StarRating';
import { postReview } from '@/features/review/apis/api';

const ReviewWritePage = () => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !content) {
      alert('평점과 후기를 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await postReview({
        projectId: 1, // 실제 프로젝트 ID로 변경
        rating,
        comment: content,
        images: [], // S3 업로드 후 URL 배열 넣기
      });
      alert(response.data || '리뷰 등록 완료');
    } catch (error) {
      console.error(error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="border-b pb-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">영상/사진/음향</p>
        <h2 className="text-xl font-bold">전국 출장 음식사진 전문</h2>

        <div className="flex justify-between items-center border rounded-lg p-4 mt-4">
          <div>
            <p className="font-semibold">📷 스튜디오 포토침</p>
            <p className="text-xs text-gray-500">평균 10분 이내 응답</p>
          </div>
          <button className="border px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
            문의
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">리뷰</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">평점</span>
            <StarRating value={rating} onChange={setRating} size={28} />
            <span className="text-sm text-gray-700 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">후기 남기기</h3>
          <button
            className="mb-3 flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
            disabled
          >
            사진 추가하기 <span className="ml-2 text-lg font-bold">＋</span>
          </button>

          <textarea
            className="w-full h-40 bg-gray-100 p-4 rounded-lg resize-none outline-none"
            placeholder="후기를 공유해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="text-right">
          <button
            className="bg-teal-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-teal-600 disabled:opacity-50"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewWritePage;
