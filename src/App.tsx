import MainLayout from './layouts/MainLayout';
import AppRouter from './router/AppRouter';

const App = () => {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
