import Home from '../pages/Home';
import ProposalPage from '../pages/proposal';
import ProjectList from '../pages/ProjectList';
import ProjectDetail from '../pages/ProjectDetail';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/projects/:groupId/:categoryId', element: <ProjectList /> },
  { path: '/project/:projectId', element: <ProjectDetail /> },
];
