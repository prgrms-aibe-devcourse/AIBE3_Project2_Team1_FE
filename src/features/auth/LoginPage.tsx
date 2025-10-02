import { AuthContext } from '@/features/auth/AuthContext';
import { login } from '@/features/auth/auth';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      alert(`${userData.nickname || '사용자'}님, 로그인 성공!`);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('로그인 실패');
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

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        로그인
      </button>
    </form>
  );
};

export default LoginPage;
