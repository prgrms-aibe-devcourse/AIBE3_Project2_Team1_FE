import Home from '../pages/Home';
import ProposalPage from '../pages/proposal';
import ProjectList from '../pages/ProjectList';


export const routes = [
  { path: '/', element: <Home /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
];
