import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordChangePage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 비밀번호 유효성 검사
  const validateNewPassword = (): string | null => {
    if (newPassword.length < 8) {
      return '새 비밀번호는 최소 8자 이상이어야 합니다.';
    }
    if (!/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      return '새 비밀번호에는 숫자와 특수문자가 포함되어야 합니다.';
    }
    if (newPassword !== confirmPassword) {
      return '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateNewPassword();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.patch('/users/info/password', {
        currentPassword,
        newPassword,
      });

      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/profile');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setErrorMessage(
          axiosError.response?.data?.message ?? '비밀번호 변경 중 오류가 발생했습니다.'
        );
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
        console.error('Axios가 아닌 에러:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <form className="flex flex-col gap-3 w-96" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-600 mb-1">현재 비밀번호</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">새 비밀번호</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">최소 8자, 숫자와 특수문자 포함</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangePage;
