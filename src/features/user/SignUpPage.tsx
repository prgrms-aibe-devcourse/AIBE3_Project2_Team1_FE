import { login } from '@/features/auth/auth';
import { AuthContext } from '@/features/auth/AuthContext';
import { signUp, type User } from '@/services/user';
import { AxiosError } from 'axios';
import { type ChangeEvent, type FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clientIcon from '@/assets/client.png';
import freelancerIcon from '@/assets/freelancer.png';

import type { Role } from '@/features/user/user';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState<{
    email: string;
    password: string;
    nickname: string;
    name: string;
    phoneNumber1: string;
    phoneNumber2: string;
    phoneNumber3: string;
    birthDate: string;
    role: Role | '';
  }>({
    email: '',
    password: '',
    nickname: '',
    name: '',
    phoneNumber1: '',
    phoneNumber2: '',
    phoneNumber3: '',
    birthDate: '',
    role: '',
  });

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handlePhoneInput = (
    e: ChangeEvent<HTMLInputElement>,
    currentField: string,
    nextField: string | null,
    maxLength: number
  ) => {
    setForm((prev) => ({ ...prev, [currentField]: e.target.value }));

    if (e.target.value.length === maxLength && nextField) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="${nextField}"]`);
      nextInput?.focus();
    }
  };

  const handleRoleSelect = (role: Role) => {
    setForm({ ...form, role });
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.role) {
      setErrorMessage('클라이언트 또는 프리랜서를 선택해주세요.');
      return;
    }

    try {
      const phoneNumber = `${form.phoneNumber1}-${form.phoneNumber2}-${form.phoneNumber3}`;

      await signUp({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        name: form.name,
        phoneNumber,
        birthDate: form.birthDate,
        role: form.role,
      });

      const loginResult = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('accessToken', loginResult.data.accessToken);
      localStorage.setItem('apiKey', loginResult.data.apiKey);
      localStorage.setItem('user', JSON.stringify(loginResult.data.item));

      setUser(loginResult.data.item as User);
      navigate('/');
    } catch (error) {
      const err = error as AxiosError<{ errorCode?: number; message?: string }>;
      setErrorMessage(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-2">
            회원가입하고 <br />
            <span className="text-rose-400 text-2xl font-extrabold">Pickple</span>
            <span className="text-gray-700">에서 꿈을 펼쳐보세요!</span>
          </h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@pickple.com"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
              required
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">닉네임</label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-rose-400 focus:border-rose-400"
              required
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <div className="flex items-center space-x-2">
              <input
                name="phoneNumber1"
                value={form.phoneNumber1}
                onChange={(e) => handlePhoneInput(e, 'phoneNumber1', 'phoneNumber2', 3)}
                placeholder="010"
                maxLength={3}
                className="w-1/3 border border-gray-300 rounded px-2 py-2 focus:ring-rose-400 focus:border-rose-400"
                required
              />
              <span>-</span>
              <input
                name="phoneNumber2"
                value={form.phoneNumber2}
                onChange={(e) => handlePhoneInput(e, 'phoneNumber2', 'phoneNumber3', 4)}
                placeholder="1234"
                maxLength={4}
                className="w-1/3 border border-gray-300 rounded px-2 py-2 focus:ring-rose-400 focus:border-rose-400"
                required
              />
              <span>-</span>
              <input
                name="phoneNumber3"
                value={form.phoneNumber3}
                onChange={(e) => handlePhoneInput(e, 'phoneNumber3', null, 4)}
                placeholder="5678"
                maxLength={4}
                className="w-1/3 border border-gray-300 rounded px-2 py-2 focus:ring-rose-400 focus:border-rose-400"
                required
              />
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-rose-400 focus:border-rose-400"
              required
            />
          </div>

          {/* 역할 선택 */}
          <div className="flex justify-center items-center space-x-6 pt-3">
            <button
              type="button"
              onClick={() => handleRoleSelect('CLIENT')}
              className={`flex flex-col items-center justify-center w-32 h-24 border rounded-md transition ${
                form.role === 'CLIENT'
                  ? 'bg-blue-400 text-white'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={clientIcon} alt="client" className="w-8 h-8 mb-2" />
              <span className="font-medium text-gray-800">클라이언트</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('FREELANCER')}
              className={`flex flex-col items-center justify-center w-32 h-24 border rounded-md transition ${
                form.role === 'FREELANCER'
                  ? 'bg-rose-400 text-white'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={freelancerIcon} alt="freelancer" className="w-8 h-8 mb-2" />
              <span
                className={`font-medium ${
                  form.role === 'FREELANCER' ? 'text-white' : 'text-gray-800'
                }`}
              >
                프리랜서
              </span>
            </button>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

          {/* 하단 버튼 */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
            >
              뒤로
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
