import { useAuth } from '@/features/auth/AuthContext';
import { login } from '@/features/auth/auth';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setUser } = useAuth();
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
      localStorage.setItem('userId', String(userData.userId ?? userData.id));

      setUser(userData);

      navigate('/');
    } catch (error) {
      const err = error as AxiosError<{ errorCode: number; message: string }>;
      console.error(err);
      const message = err.response?.data?.message || '로그인 실패';
      setErrorMessage(message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    const allowedProviders = ['kakao', 'naver', 'google'];
    if (!allowedProviders.includes(provider)) {
      console.error('지원하지 않는 소셜 로그인 제공자입니다.');
      return;
    }
    const baseUrl = 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Pickple 로그인</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력해 주세요."
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요."
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500 transition"
          >
            이메일 로그인
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition flex items-center justify-center"
          >
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin('naver')}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition flex items-center justify-center"
          >
            네이버로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center"
          >
            구글로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
