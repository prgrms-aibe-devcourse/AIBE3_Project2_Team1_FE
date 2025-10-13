import React, { useState } from 'react';
import PortfolioUpload from './PortfolioUpload';
import MatchingModal from './MatchingModal';
import { axiosInstance } from '../../services/axios';

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
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const title =
    targetType === 'client' ? '클라이언트에게 매칭 제안하기' : '프리랜서에게 매칭 제안하기';

  const comment = targetType === 'client' ? '클라이언트에게 보내는 말' : '프리랜서에게 보내는 말';

  const handleSubmit = async (
    e: React.FormEvent,
    submitAction: 'submit' | 'draft'
  ): Promise<void> => {
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
      const proposalData = {
        projectId: projectId,
        description: message,
        proposedAmount: amount,
        status: submitAction === 'submit' ? 'SUBMITTED' : 'DRAFT',
      };

      formData.append(
        'proposal',
        new Blob([JSON.stringify(proposalData)], { type: 'application/json' })
      );
      // 여러 개 파일 추가
      files.forEach((file) => {
        formData.append('portfolioFiles', file);
      });

      if (submitAction === 'submit') {
        if (!proposalId) {
          // 임시저장 없이 바로 제출한 경우
          await axiosInstance.post('/proposals', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // 임시저장된 제안서가 이미 존재하면 PATCH로 업데이트 + 상태 변경
          await axiosInstance.patch(`/proposals/${proposalId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        setShowModal(true);
      } else if (submitAction === 'draft') {
        let response;
        if (!proposalId) {
          response = await axiosInstance.post('/proposals', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const newId = response.data?.data?.proposalId;
          if (newId) setProposalId(newId);
        } else {
          await axiosInstance.patch(`/proposals/${proposalId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        setToastMessage('임시저장 성공!');
        setTimeout(() => setToastMessage(null), 2000);
      }
    } catch (error) {
      if (submitAction === 'submit') {
        console.error('제출 실패:', error);
        alert('제출에 실패했습니다.');
      } else if (submitAction === 'draft') {
        console.error('임시저장 실패:', error);
        alert('임시저장에 실패했습니다.');
      }
    }
  };
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all">
          {toastMessage}
        </div>
      )}
      <form className="space-y-6">
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
          type="button"
          onClick={(e) => handleSubmit(e as React.FormEvent, 'submit')}
          className="w-full py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
        >
          제출하기
        </button>

        <button
          type="button"
          onClick={(e) => handleSubmit(e as React.FormEvent, 'draft')}
          className="w-full py-3 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
        >
          임시저장
        </button>
      </form>

      {/* 모달 표시 */}
      {showModal && <MatchingModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ProposalMatchForm;
