const Footer = () => {
  return (
    <footer className="bg-white border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-rose-500 font-bold text-lg mb-2">Pickple</h2>
          <p>
            픽플은 프리랜서와 클라이언트를 연결하는 플랫폼입니다. <br />
            AI 시스템으로 정확한 매칭을 제공합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">서비스</h3>
          <ul className="space-y-1">
            <li>프리랜서 찾기</li>
            <li>프로젝트 찾기</li>
            <li>프리랜서 되기</li>
            <li>AI 매칭 서비스</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">고객 지원</h3>
          <ul className="space-y-1">
            <li>도움말</li>
            <li>문의 하기</li>
            <li>신고 하기</li>
            <li>자주 묻는 질문</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t">
        © 2024 Pickple. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
