import { AuthContext } from '@/features/auth/AuthContext';
import { login } from '@/features/auth/auth';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailIcon from '@/assets/email.png';
import kakaoIcon from '@/assets/kakao.png';
import naverIcon from '@/assets/naver.png';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage('');
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
    } catch (err) {
      const error = err as AxiosError<{ errorCode: number; message: string }>;
      console.error(error);
      const message = error.response?.data?.message || '로그인 실패';
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@pickple.com"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력해 주세요."
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </form>

        <div className="space-y-2">
          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100">
            <img src={emailIcon} alt="email" />
          </button>
          <button className="w-full flex items-center justify-center bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition">
            <img src={kakaoIcon} alt="kakao" />
          </button>
          <button className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            <img src={naverIcon} alt="naver" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
