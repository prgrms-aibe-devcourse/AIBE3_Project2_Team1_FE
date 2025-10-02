import { login } from '@/features/auth/auth';
import { AuthContext } from '@/features/auth/AuthContext';
import { signUp, type User } from '@/services/user';
import { type ChangeEvent, type FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    name: '',
    phoneNumber: '',
    birthDate: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signUp(form);

      const loginResult = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('accessToken', loginResult.data.accessToken);
      localStorage.setItem('apiKey', loginResult.data.apiKey);
      localStorage.setItem('user', JSON.stringify(loginResult.data.item));

      setUser(loginResult.data.item as User); // 타입 지정

      alert('회원가입 및 로그인 성공!');
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      alert(
        (err as { response?: { data?: { msg?: string } } }).response?.data?.msg || '회원가입 실패'
      );
    }
  };

  return (
    <form onSubmit={handleSignUp} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">회원가입</h1>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key as keyof typeof form]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 mb-2 w-full"
          type={key === 'password' ? 'password' : 'text'}
          required
        />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        가입하기
      </button>
    </form>
  );
};

export default SignUpPage;
