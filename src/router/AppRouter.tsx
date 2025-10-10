import { Routes, Route } from 'react-router-dom';
import { mainRoutes, noLayoutRoutes } from './routes';

import MainLayout from '@/layouts/MainLayout';
import NoLayout from '@/layouts/NoLayout';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<NoLayout />}>
        {noLayoutRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<MainLayout />}>
        {mainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRouter;
