import ProposalMatchForm from '../ProposalMatchForm';

const ClientProposalMatchPage = ({ projectId }: { projectId: string }) => {
  return <ProposalMatchForm targetType="client" projectId={Number(projectId)} />;
};

export default ClientProposalMatchPage;
