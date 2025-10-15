import { useEffect, useState } from 'react';
import { axiosInstance } from '@/services/axios';

export interface ProposalItem {
  id: number;
  title: string;
  status: string;
}

interface SentProposal {
  proposalId: number;
  createDate: string; // LocalDateTime → string (ISO 형식)
  updateDate: string;
  projectId: number;
  senderId: number;
  description: string;
  proposedAmount: number;
  portfolioFiles: ProposalFileResponseDto[];
  proposalStatus: ProposalStatus;
}

interface ProposalFileResponseDto {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
}

type ProposalStatus = 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'DRAFT';

function useReceivedProposals() {
  const [proposals, setProposal] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceivedProposals = async () => {
      try {
        const res = await axiosInstance.get('/proposals/sent');
        const proposals: SentProposal[] = res.data.data;

        const mapped = proposals.map((p) => ({
          id: p.proposalId,
          title: `${p.description}`,
          status: p.proposalStatus,
        }));

        setProposal(mapped);
      } catch (err) {
        console.error('받은 제안서 불러오기 실패:', err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedProposals();
  }, []);

  return { proposals, loading, error };
}
export default useReceivedProposals;
