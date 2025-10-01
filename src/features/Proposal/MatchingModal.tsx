import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
}

const MatchingModal: React.FC<ModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose(); // 모달 닫기
    navigate('/'); // 홈으로 리다이렉트
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center">
        <h2 className="text-lg font-semibold mb-2">매칭 요청이 완료되었습니다</h2>
        <p className="text-gray-600 mb-6">다양한 클라이언트와 프리랜서를 만나 보세요!</p>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          메인으로
        </button>
      </div>
    </div>
  );
};

export default MatchingModal;
