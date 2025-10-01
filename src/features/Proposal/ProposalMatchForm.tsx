import React, { useState } from 'react';
import PortfolioUpload from './PortfolioUpload';
import MatchingModal from './MatchingModal';
import axios from 'axios';

interface ProposalMatchFormProps {
  targetType: 'client' | 'freelancer';
  targetName: string;
  projectId: number;
}

const ProposalMatchForm: React.FC<ProposalMatchFormProps> = ({
  targetType,
  targetName,
  projectId,
}) => {
  // 공통 로직
  const [amount, setAmount] = useState<number | ''>('');
  const [message, setMessage] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);

  const title =
    targetType === 'client' ? '클라이언트에게 매칭 제안하기' : '프리랜서에게 매칭 제안하기';

  const comment = targetType === 'client' ? '클라이언트에게 보내는 말' : '프리랜서에게 보내는 말';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('제안 금액을 입력해주세요.');
      return;
    }
    if (!message.trim()) {
      alert('메시지를 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('projectId', projectId.toString());
      formData.append('description', message);
      formData.append('proposedAmount', amount.toString());
      // 여러 개 파일 추가
      files.forEach((file) => {
        formData.append('portfolioFiles', file);
        // key 이름을 서버 DTO랑 맞춰야 함
      });

      await axios.post('/api/proposals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowModal(true);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다.');
    }

    // 임시: API 구현 전까지 모달 표시
  };
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
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
            {comment}
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* 파일 업로드 */}
        <PortfolioUpload onFilesSelect={setFiles} />

        {/* 안내 문구 */}
        <p className="text-center text-gray-600">{targetName}님의 프로젝트와 매칭하시겠습니까?</p>

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

export default ProposalMatchForm;
