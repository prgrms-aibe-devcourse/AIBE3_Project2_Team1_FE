import React, { useState } from 'react';
import PortfolioUpload from '../PortfolioUpload';
import MatchingModal from '../MatchingModal';

const ClientProposalMatchPage: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [message, setMessage] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 요청 처리
    setShowModal(true); // 제출 시 모달 열기
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6">클라이언트에게 매칭 제안하기</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제안 금액 */}
        <div>
          <label htmlFor="amount" className="block font-medium mb-2">
            제안 금액
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="금액을 입력하세요"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <span className="text-gray-700">원</span>
          </div>
        </div>

        {/* 메시지 */}
        <div>
          <label htmlFor="message" className="block font-medium mb-2">
            클라이언트에게 보내는 말
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <PortfolioUpload />

        {/* 안내 문구 */}
        <p className="text-center text-gray-600">아샷추 님의 프로젝트와 매칭하시겠습니까?</p>

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
        >
          매칭하기
        </button>
      </form>

      {/* 모달 표시 */}
      {showModal && <MatchingModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ClientProposalMatchPage;
