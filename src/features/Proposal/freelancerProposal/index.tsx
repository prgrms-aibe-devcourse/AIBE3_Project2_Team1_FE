import ProposalMatchForm from '../ProposalMatchForm';

const FreelancerProposalMatchPage = ({ projectId }: { projectId: string }) => {
  return <ProposalMatchForm targetType="freelancer" projectId={Number(projectId)} />;
};
export default FreelancerProposalMatchPage;
