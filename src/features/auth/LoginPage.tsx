import { AuthContext } from '@/features/auth/AuthContext';
import { login } from '@/features/auth/auth';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>(''); // 에러 메시지 상태
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage(''); // 입력 변경 시 에러 초기화
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await login(form);
      const userData = result.data.item;
      const accessToken = result.data.accessToken;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      navigate('/');
    } catch (error) {
      const err = error as AxiosError<{ errorCode: number; message: string }>;

      console.error(err);

      const errorCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message || '로그인 실패';

      if (errorCode) {
        setErrorMessage(message); // 실패 이유 저장
      } else {
        setErrorMessage('로그인 실패');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">로그인</h1>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        로그인
      </button>
    </form>
  );
};

export default LoginPage;
