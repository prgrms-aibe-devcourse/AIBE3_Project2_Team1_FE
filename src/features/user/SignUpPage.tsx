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
    phoneNumber1: '',
    phoneNumber2: '',
    phoneNumber3: '',
    birthDate: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const phoneNumber = `${form.phoneNumber1}-${form.phoneNumber2}-${form.phoneNumber3}`;

      await signUp({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        name: form.name,
        phoneNumber,
        birthDate: form.birthDate,
      });

      const loginResult = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('accessToken', loginResult.data.accessToken);
      localStorage.setItem('apiKey', loginResult.data.apiKey);
      localStorage.setItem('user', JSON.stringify(loginResult.data.item));

      setUser(loginResult.data.item as User);

      alert('회원가입 및 로그인 성공!');
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      alert(
        (err as { response?: { data?: { msg?: string } } }).response?.data?.msg || '회원가입 실패'
      );
    }
  };

  const handlePhoneInput = (
    e: ChangeEvent<HTMLInputElement>,
    currentField: string,
    nextField: string | null,
    maxLength: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [currentField]: e.target.value,
    }));

    if (e.target.value.length === maxLength && nextField) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="${nextField}"]`);
      nextInput?.focus();
    }
  };

  return (
    <form onSubmit={handleSignUp} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">회원가입</h1>

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 mb-2 w-full"
        type="email"
        required
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="border p-2 mb-2 w-full"
        type="password"
        required
      />
      <input
        name="nickname"
        value={form.nickname}
        onChange={handleChange}
        placeholder="닉네임"
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="이름"
        className="border p-2 mb-2 w-full"
        required
      />

      {/* 전화번호 입력 */}
      <div className="flex space-x-2 mb-4">
        <input
          name="phoneNumber1"
          value={form.phoneNumber1}
          onChange={(e) => handlePhoneInput(e, 'phoneNumber1', 'phoneNumber2', 3)}
          placeholder="010"
          className="border p-2 w-1/3 rounded"
          maxLength={3}
          required
        />
        <span className="flex items-center">-</span>
        <input
          name="phoneNumber2"
          value={form.phoneNumber2}
          onChange={(e) => handlePhoneInput(e, 'phoneNumber2', 'phoneNumber3', 4)}
          placeholder="1234"
          className="border p-2 w-1/3 rounded"
          maxLength={4}
          required
        />
        <span className="flex items-center">-</span>
        <input
          name="phoneNumber3"
          value={form.phoneNumber3}
          onChange={(e) => handlePhoneInput(e, 'phoneNumber3', null, 4)}
          placeholder="5678"
          className="border p-2 w-1/3 rounded"
          maxLength={4}
          required
        />
      </div>

      {/* 생일 입력 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">생년월일</label>
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        가입하기
      </button>
    </form>
  );
};

export default SignUpPage;
