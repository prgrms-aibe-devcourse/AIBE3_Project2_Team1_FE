import ProposalMatchForm from '../ProposalMatchForm';

const FreelancerProposalMatchPage = ({ projectId }: { projectId: string }) => {
  return (
    <ProposalMatchForm targetType="freelancer" targetName="아샷추" projectId={Number(projectId)} />
  );
};
export default FreelancerProposalMatchPage;
