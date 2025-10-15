import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortfolioUpload from '../features/Proposal/PortfolioUpload';
import { axiosInstance } from '@/services/axios';

interface ProposalData {
  proposedAmount: number | '';
  description: string;
  fileUrls: string[];
}

const DraftProposalPage: React.FC = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState<ProposalData>({
    proposedAmount: '',
    description: '',
    fileUrls: [],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /** ✅ 제안서 불러오기 */
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/proposals/${proposalId}`); // 실제 API로 교체
        const data = res.data.data;

        setProposal({
          proposedAmount: data.proposedAmount ?? '',
          description: data.description ?? '',
          fileUrls: data.portfolioFiles?.map((f: { fileUrl: string }) => f.fileUrl) ?? [],
        });
      } catch (err) {
        console.error('제안서 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  const handleChange = (field: keyof ProposalData, value: string | number) => {
    setProposal((prev) => ({ ...prev, [field]: value }));
  };

  /** ✅ 파일 단건 다운로드 (파일명 클릭 시) */
  const handleDownload = async (fileUrl: string) => {
    try {
      const key = fileUrl.split('.com/')[1];
      const res = await axiosInstance.get(`/files/presigned?fileName=${encodeURIComponent(key)}`); // presigned URL API 교체
      const presignedUrl: string = res.data;

      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = decodeURIComponent(fileUrl.split('/').pop()!);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('파일 다운로드 실패:', err);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  /** ✅ 파일 삭제 */
  const handleDeleteFile = async (fileUrl: string) => {
    if (!window.confirm('이 파일을 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/files?fileUrl=${encodeURIComponent(fileUrl)}`);

      setProposal((prev) => ({
        ...prev,
        fileUrls: prev.fileUrls.filter((url) => url !== fileUrl),
      }));

      alert('파일이 삭제되었습니다.');
    } catch (err) {
      console.error('파일 삭제 실패:', err);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  /** ✅ 저장 / 임시저장 */
  const handleSave = async (action: 'save' | 'draft') => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // ✅ 기존 파일 URL + 새 파일 구분 없이 모두 서버로 전달
      const payload = {
        proposedAmount: proposal.proposedAmount,
        description: proposal.description,
        status: action === 'save' ? 'SUBMITTED' : 'DRAFT',
      };

      formData.append(
        'proposal',
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );

      // ✅ 새로 업로드한 파일도 같이 추가
      files.forEach((file) => {
        formData.append('portfolioFiles', file);
      });

      await axiosInstance.patch(`/proposals/${proposalId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (action === 'save') {
        alert('제안서가 성공적으로 저장되었습니다.');
        navigate('/profile');
      } else {
        setToastMessage('임시저장 성공!');
        setTimeout(() => setToastMessage(null), 2000);
      }
    } catch (err) {
      console.error(`${action === 'save' ? '저장' : '임시저장'} 실패:`, err);
      alert(`${action === 'save' ? '저장' : '임시저장'} 중 오류가 발생했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-gray-500">제안서 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6">제안서 수정하기</h2>

      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
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
              value={proposal.proposedAmount}
              onChange={(e) => handleChange('proposedAmount', Number(e.target.value))}
              placeholder="금액을 입력하세요"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <span className="text-gray-700">원</span>
          </div>
        </div>

        {/* 보내는 말 */}
        <div>
          <label htmlFor="description" className="block font-medium mb-2">
            보내는 말
          </label>
          <textarea
            id="description"
            value={proposal.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="보내는 말을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* 파일 업로드 */}
        <PortfolioUpload onFilesSelect={setFiles} />

        {/* 기존 첨부 파일 목록 */}
        {proposal.fileUrls.length > 0 && (
          <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <label className="block font-medium mb-3 text-gray-700">첨부된 파일</label>
            <ul className="space-y-2">
              {proposal.fileUrls.map((url, idx) => {
                const fileName = decodeURIComponent(url.split('/').pop()!);
                return (
                  <li
                    key={idx}
                    className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleDownload(url)}
                      className="truncate text-emerald-600 hover:underline text-left w-3/4"
                    >
                      📎 {fileName}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(url)}
                      className="text-red-500 hover:text-red-600 font-medium text-sm"
                    >
                      삭제
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 버튼 영역 */}
        <button
          type="button"
          onClick={() => handleSave('save')}
          disabled={isSubmitting}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>

        <button
          type="button"
          onClick={() => handleSave('draft')}
          disabled={isSubmitting}
          className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? '임시저장 중...' : '임시저장'}
        </button>
      </form>
    </div>
  );
};

export default DraftProposalPage;
