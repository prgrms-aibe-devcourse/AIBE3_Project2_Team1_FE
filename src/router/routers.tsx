import { createBrowserRouter } from 'react-router-dom';
import ProjectList from '../pages/ProjectList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>홈</div>,
  },
  {
    path: '/ProjectList',
    element: <ProjectList />,
  },
]);

export default router;
