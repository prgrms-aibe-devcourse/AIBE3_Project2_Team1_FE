import axios, { type AxiosError } from 'axios';
import React, { type ChangeEvent, useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../profile';

interface ProfileForm {
  title: string;
  description: string;
  hourlyRate: number;
  skills: string;
  visibility: 'PUBLIC' | 'PRIVATE' | undefined;
}

const UserEditPage: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>({
    title: '',
    description: '',
    hourlyRate: 0,
    skills: '',
    visibility: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const data = res.data;
        setForm({
          title: data?.title ?? '',
          description: data?.description ?? '',
          hourlyRate: data?.hourlyRate ?? 0,
          skills: data?.skills ?? '',
          visibility: data?.visibility ?? 'PUBLIC',
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string }>;
          setErrorMessage(
            axiosError.response?.data?.message ?? '프로필 정보를 불러오는 중 오류가 발생했습니다.'
          );
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다.');
          console.error(error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'hourlyRate' ? Number(value) : value,
    }));
  };

  const handleVisibilityChange = (value: 'PUBLIC' | 'PRIVATE') => {
    setForm((prev) => ({
      ...prev,
      visibility: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await updateMyProfile({
        title: form.title,
        description: form.description,
        hourlyRate: form.hourlyRate,
        skills: form.skills,
        visibility: form.visibility,
      });
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
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">소개</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">시간 당 요금</label>
            <input
              type="number"
              name="hourlyRate"
              value={form.hourlyRate}
              onChange={handleChange}
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">보유 기술</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">공개 설정</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleVisibilityChange('PUBLIC')}
                className={`px-4 py-2 rounded-md border transition ${
                  form.visibility === 'PUBLIC'
                    ? 'bg-rose-400 text-white border-rose-400'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                공개
              </button>
              <button
                type="button"
                onClick={() => handleVisibilityChange('PRIVATE')}
                className={`px-4 py-2 rounded-md border transition ${
                  form.visibility === 'PRIVATE'
                    ? 'bg-rose-400 text-white border-rose-400'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                비공개
              </button>
            </div>
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

export default UserEditPage;
