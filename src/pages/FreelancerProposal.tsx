import FreelancerProposalPage from '../features/Proposal/freelancerProposal';
import { useParams } from 'react-router-dom';

const FreelancerProposal = () => {
  const { projectId } = useParams();
  return <FreelancerProposalPage projectId={projectId ?? ''} />;
};

export default FreelancerProposal;
