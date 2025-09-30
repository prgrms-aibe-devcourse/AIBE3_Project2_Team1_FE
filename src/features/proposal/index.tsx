const ProposalMatchPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow p-4 flex justify-center items-center">
        <nav className="flex gap-6">
          <a href="#">문서/글쓰기</a>
          <a href="#">IT/프로그래밍</a>
          <a href="#">마케팅</a>
          <a href="#">취미 레슨</a>
          <a href="#">세무/법무/노무</a>
          <a href="#">창업/사업</a>
          <a href="#">번역/통역</a>
        </nav>
      </header>

      {/* 본문 */}
      <main className="max-w-2xl mx-auto py-12 px-4">
        {/* 프로젝트 설명 카드 */}
        <div className="bg-gray-200 h-48 flex items-center justify-center rounded-lg">
          프로젝트에 대한 설명 및 관련 사진
        </div>

        {/* 카테고리 드롭다운 */}
        <div className="mt-6">
          <select className="w-full border rounded p-2">
            <option>카테고리</option>
            <option>문서/글쓰기</option>
            <option>IT/프로그래밍</option>
            <option>마케팅</option>
            <option>취미 레슨</option>
            <option>세무/법무/노무</option>
            <option>창업/사업</option>
            <option>번역/통역</option>
          </select>
        </div>

        {/* 매칭 확인 영역 */}
        <div className="mt-10 bg-emerald-400 text-white text-center p-6 rounded-lg text-lg font-medium">
          아샷추 님의 프로젝트와 매칭하시겠습니까?
        </div>

        {/* 버튼 */}
        <div className="flex justify-center mt-6">
          <button className="bg-[#FF6B6B] hover:bg-pink-600 text-white px-6 py-2 rounded-lg">
            매칭하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProposalMatchPage;
