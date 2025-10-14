import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/services/axios';
import { Upload } from 'lucide-react';

interface ProposalData {
  fileName: string;
  proposedAmount: number;
  description: string;
}

const ProposalPage = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAccept = async () => {
    try {
      await axiosInstance.patch(`/proposals/${proposalId}/accept`, {
        proposalStatus: 'ACCEPTED',
      });
      alert('매칭을 수락했습니다!');
    } catch (err) {
      console.error(err);
      alert('매칭 수락에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.patch(`/proposals/${proposalId}/reject`, {
        proposalStatus: 'REJECTED',
      });
      alert('매칭을 거절했습니다.');
    } catch (err) {
      console.error(err);
      alert('매칭 거절에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/proposals/${proposalId}`);
        const data = res.data.data;

        // ✅ 서버 구조에 따라 필드명 매핑
        setProposal({
          fileName: data.portfolioFiles?.[0]?.fileName ?? '명세서(첨부된 파일 없음)',
          proposedAmount: data.proposedAmount,
          description: data.description,
        });
      } catch (err) {
        console.error('제안서 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-gray-500">제안서 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-gray-500">제안서를 찾을 수 없습니다.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex flex-col items-center flex-grow px-4 py-12">
        <div className="w-full max-w-lg flex flex-col gap-6">
          {/* 제안 금액 */}
          <div>
            <label className="block font-medium mb-2">제안 금액</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                {proposal.proposedAmount.toLocaleString()}
              </div>
              <span className="text-gray-700">원</span>
            </div>
          </div>

          {/* 보내는 말 */}
          <div>
            <label className="block font-medium mb-2">보내는 말</label>
            <div className="w-full min-h-[10rem] p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 whitespace-pre-wrap">
              {proposal.description || '내용이 없습니다.'}
            </div>
          </div>

          {/* 파일 이름 + 다운로드 버튼 */}
          <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <span className="text-gray-600 truncate">{proposal.fileName}</span>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="파일 다운로드"
              onClick={() => window.open(`/proposals/${proposalId}/file`, '_blank')}
            >
              <Upload className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
            >
              매칭 거절
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-[#1ABC9C] hover:bg-[#16a085] rounded-lg text-white font-medium transition"
            >
              매칭 수락
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProposalPage;
