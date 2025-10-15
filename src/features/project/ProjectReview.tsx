import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Review {
  reviewId: number;
  targetNickname: string;
  rating: number;
  comment: string;
  createdDate: string;
  images: string[];
}

export default function ServiceInfo() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortType, setSortType] = useState<'latest' | 'rating'>('latest');
  const [loading, setLoading] = useState(true);

  // ✅ 리뷰 불러오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/v1/reviews/project/${projectId}`);
        if (res.data?.data) {
          setReviews(res.data.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('리뷰 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [projectId]);

  // ⭐ 평균 별점
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // 🖼️ 모든 리뷰의 이미지 모아보기
  const allPhotos = useMemo(() => reviews.flatMap((r) => r.images || []), [reviews]);

  // 🔄 정렬된 리뷰
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortType === 'latest') {
      sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortType === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [sortType, reviews]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">리뷰를 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen font-sans px-6 py-10">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-6">
        {/* 평균 별점 */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-2xl">★</span>
          <span className="font-bold text-xl">{averageRating}</span>
          <span className="text-gray-500 text-sm">({reviews.length}개의 리뷰)</span>
        </div>

        {/* ➕ 리뷰 작성 버튼 */}
        <button
          onClick={() => navigate(`/review/write/${projectId}`)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm transition"
        >
          리뷰 작성하기
        </button>
      </div>

      {/* 포토 영역 */}
      {allPhotos.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {allPhotos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`리뷰 사진 ${i + 1}`}
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      {/* 정렬 옵션 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">서비스 리뷰 {reviews.length}건</h3>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as 'latest' | 'rating')}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="rating">별점순</option>
        </select>
      </div>

      {/* 리뷰 목록 */}
      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <div key={review.reviewId} className="flex gap-4 items-start border-b py-4">
            {/* 기본 프로필 */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
              {review.targetNickname?.[0] || '유'}
            </div>

            {/* 리뷰 본문 */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{review.targetNickname}</span>
                <span className="text-sm text-gray-400">
                  {review.rating} ★ · {review.createdDate}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{review.comment}</p>

              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {review.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="리뷰 사진"
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-10">등록된 리뷰가 없습니다.</div>
      )}
    </div>
  );
}
