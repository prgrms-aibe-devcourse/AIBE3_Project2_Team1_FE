import MainLayout from './layouts/MainLayout';
import AppRouter from './router/AppRouter';

import { RouterProvider } from 'react-router-dom';
import router from './router/routers';

const App = () => {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
  return <RouterProvider router={router} />;
};

export default App;
