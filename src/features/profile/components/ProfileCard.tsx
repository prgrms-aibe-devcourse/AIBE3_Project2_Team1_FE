import { getMyUser } from '@/features/profile/profile';
import { updateUserMode } from '@/services/user';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileCardProps } from '../types';

export default function ProfileCard({
  role,
  setRole,
  name,
  email,
  title,
  skills,
  completedCount,
  inProgressCount,
  profileImgUrl,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await getMyUser(); // 유저 정보 조회
        const role = res.data.role; // CLIENT / FREELANCER

        if (role === 'CLIENT') setRole('client');
        else if (role === 'FREELANCER') setRole('freelancer');
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
      }
    };

    fetchUserRole();
  }, [setRole]);

  const handleRoleChange = async (newRole: 'client' | 'freelancer') => {
    if (loading || newRole === role) return;
    setLoading(true);

    try {
      await updateUserMode(newRole.toUpperCase() as 'CLIENT' | 'FREELANCER');
      setRole(newRole);
    } catch (error) {
      console.error('모드 변경 실패:', error);
      alert('모드 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl w-full mx-auto mt-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
          {profileImgUrl ? (
            <img
              src={profileImgUrl}
              alt={`${name} 프로필`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">No Image</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{name || '알 수 없음'}</h2>
            <button
              onClick={() => navigate('/user/edit')}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300"
            >
              회원정보 수정
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300"
            >
              프로필 수정
            </button>
          </div>

          <p className="text-gray-500 text-sm">{email}</p>
          <p className="mt-1 text-sm text-gray-600">
            한 줄 소개 : {title ? title : '설명이 없습니다.'}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            보유 기술 : {skills ? skills : '보유 기술을 작성해주세요.'}
          </p>

          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>
              완료한 의뢰 <b className="text-black">{completedCount ?? 0}건</b>
            </span>
            <span>
              진행 중인 의뢰 <b className="text-black">{inProgressCount ?? 0}건</b>
            </span>
          </div>
        </div>

        {/* 모드 선택 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleChange('client')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              role === 'client' ? 'bg-red-400 text-white' : 'bg-white text-gray-700'
            }`}
          >
            클라이언트 모드
          </button>
          <button
            onClick={() => handleRoleChange('freelancer')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-full border transition ${
              role === 'freelancer' ? 'bg-red-400 text-white' : 'bg-white text-gray-700'
            }`}
          >
            프리랜서 모드
          </button>
        </div>
      </div>
    </section>
  );
}
