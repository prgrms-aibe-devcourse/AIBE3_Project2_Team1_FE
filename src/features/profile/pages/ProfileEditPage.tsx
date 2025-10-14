import axios, { type AxiosError } from 'axios';
import React, { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import ProfileImage from '../components/ProfileImage';
import { getMyUser, updateMyUser } from '../profile';

interface ProfileForm {
  name: string;
  nickname: string;
  phone: string; // "010-1234-5678"
  birth: string; // YYYY-MM-DD
}

// 휴대전화 숫자만 필터링 + 자동 하이픈
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const ProfileEditPage: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    nickname: '',
    phone: '',
    birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getMyUser();
        setForm({
          name: res.data.name ?? '',
          nickname: res.data.nickname ?? '',
          phone: res.data.phoneNumber ?? '',
          birth: res.data.birth ?? '',
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string }>;
          setErrorMessage(
            axiosError.response?.data?.message ?? '사용자 정보를 불러오는 중 오류가 발생했습니다.'
          );
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다.');
          console.error(error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 숫자만 입력 허용
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const updateData = {
      name: form.name,
      nickname: form.nickname,
      phoneNumber: form.phone,
      birthDate: form.birth, // 서버 필드명에 맞춤
    };

    console.log('업데이트 데이터:', updateData); // 요청 확인용

    try {
      await updateMyUser(updateData);
      setSuccessMessage('프로필이 성공적으로 수정되었습니다.');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setErrorMessage(
          axiosError.response?.data?.message ?? '프로필 수정 중 오류가 발생했습니다.'
        );
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex gap-16">
        <ProfileImage />

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">이름</label>
            <input
              type="text"
              name="name"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">닉네임</label>
            <input
              type="text"
              name="nickname"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              value={form.nickname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">휴대전화</label>
            <input
              type="text"
              name="phone"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              value={form.phone}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={13}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">생년월일</label>
            <input
              type="date"
              name="birth"
              className="w-40 border rounded-md px-2 py-2"
              value={form.birth}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-1">{successMessage}</p>}

          <button
            type="submit"
            className="mt-6 bg-rose-400 text-white py-2 rounded-md hover:bg-rose-500 transition"
            disabled={loading}
          >
            {loading ? '수정 중...' : '프로필 수정'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
