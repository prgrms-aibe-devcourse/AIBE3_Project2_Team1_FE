import { RouterProvider } from 'react-router-dom';
import router from './router/routers';

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
