export default function ServiceInfo() {
  return (
    <div className="min-h-screen font-sans">
      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400">★</span>
        <span className="font-bold text-lg">4.5</span>
      </div>

      {/* Photos */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>

      {/* Reviews */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">서비스 리뷰 200건</h3>
        <span className="text-sm text-gray-500">최신순 ▾</span>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 items-start border-b py-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="flex justify-between items-center w-full">
              <span className="font-semibold">김지원</span>
              <span className="text-sm text-gray-400">4.5 · 2025.09.25</span>
            </div>
            <p className="text-gray-700 mt-1">정말 감사합니다</p>
          </div>
        </div>
      ))}
    </div>
  );
}
