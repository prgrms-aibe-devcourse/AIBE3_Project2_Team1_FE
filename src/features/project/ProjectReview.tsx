import React, { useState, useMemo } from 'react';

export default function ServiceInfo() {
  const [sortType, setSortType] = useState<'latest' | 'rating'>('latest');

  const reviews = [
    {
      id: 1,
      user: '김지원',
      rating: 4.5,
      date: '2025-09-25',
      content: '정말 감사합니다',
      photos: ['/img/review1.jpg', '/img/review2.jpg'],
    },
    {
      id: 2,
      user: '홍길동',
      rating: 5,
      date: '2025-10-01',
      content: '최고의 서비스!',
      photos: ['/img/review3.jpg'],
    },
    {
      id: 3,
      user: '이수민',
      rating: 3.5,
      date: '2025-09-20',
      content: '괜찮았어요.',
      photos: [],
    },
  ];

  // 📊 평균 별점 계산
  const averageRating = useMemo(() => {
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // 🖼️ 모든 리뷰의 사진 모아보기
  const allPhotos = useMemo(() => reviews.flatMap((r) => r.photos), [reviews]);

  // 🔄 정렬된 리뷰 목록
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortType === 'latest') {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortType === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [sortType, reviews]);

  return (
    <div className="min-h-screen font-sans px-6 py-10">
      {/* 평균 별점 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-2xl">★</span>
        <span className="font-bold text-xl">{averageRating}</span>
        <span className="text-gray-500 text-sm">({reviews.length}개의 리뷰)</span>
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
      {sortedReviews.map((review) => (
        <div key={review.id} className="flex gap-4 items-start border-b py-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{review.user}</span>
              <span className="text-sm text-gray-400">
                {review.rating} ★ · {review.date}
              </span>
            </div>
            <p className="text-gray-700 mt-1">{review.content}</p>
            {review.photos.length > 0 && (
              <div className="flex gap-2 mt-2">
                {review.photos.map((src, i) => (
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
      ))}
    </div>
  );
}
