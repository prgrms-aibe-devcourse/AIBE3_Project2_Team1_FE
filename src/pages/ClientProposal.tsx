import ClientProposalPage from '../features/Proposal/clientProposal';
import { useParams } from 'react-router-dom';

const ClientProposal = () => {
  const { projectId } = useParams();

  return <ClientProposalPage projectId={projectId ?? ''} />;
};

export default ClientProposal;
