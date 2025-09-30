import MainLayout from './layouts/MainLayout';

import { RouterProvider } from 'react-router-dom';
import router from './router/routers';

const App = () => {
  return (
    <MainLayout>
      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold text-rose-500">핫 식스 프론트엔드</h1>
        <p className="mt-2 text-gray-500">Tailwind 테스트 중입니다</p>
      </div>
    </MainLayout>
  );
  return <RouterProvider router={router} />;
};

export default App;
