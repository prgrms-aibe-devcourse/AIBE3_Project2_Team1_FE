import ProposalMatchForm from '../ProposalMatchForm';

const ClientProposalMatchPage = ({ projectId }: { projectId: string }) => {
  return (
    <ProposalMatchForm targetType="client" targetName="아샷추" projectId={Number(projectId)} />
  );
};

export default ClientProposalMatchPage;
