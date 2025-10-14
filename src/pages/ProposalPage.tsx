import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/services/axios';

interface ProposalData {
  fileUrls: string[];
  proposedAmount: number;
  description: string;
}

const ProposalPage = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSingleDownload = async (fileUrl: string) => {
    try {
      const key = fileUrl.split('.com/')[1]; // S3 key 추출
      const res = await axiosInstance.get(`/files/presigned?fileName=${encodeURIComponent(key)}`);
      const presignedUrl: string = res.data;

      // 브라우저 다운로드 트리거
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = fileUrl.split('/').pop()!;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('파일 다운로드 실패:', err);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

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

        // 서버 구조에 따라 필드명 매핑
        setProposal({
          fileUrls: data.portfolioFiles?.map((f: { fileUrl: string }) => f.fileUrl) ?? [],
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

          {/* 파일 목록 + 개별 다운로드 버튼 */}
          <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <label className="block font-medium mb-3 text-gray-700">첨부 파일</label>

            {proposal.fileUrls.length > 0 ? (
              <ul className="space-y-2">
                {proposal.fileUrls.map((url, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
                  >
                    <span className="truncate text-gray-700 w-3/4">
                      📎 {decodeURIComponent(url.split('/').pop()!)}
                    </span>
                    <button
                      onClick={() => handleSingleDownload(url)}
                      className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                      다운로드
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">첨부된 파일이 없습니다.</p>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleReject}
              className="px-6 py-3  bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
            >
              매칭 거절
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
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
