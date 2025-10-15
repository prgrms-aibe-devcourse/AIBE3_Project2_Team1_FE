import { useNavigate } from 'react-router-dom';
import type { ProfileCardProps } from '../types';

export default function ProfileCard({
  mode,
  setMode,
  name,
  email,
  title,
  skills,
  completedCount,
  inProgressCount,
  profileImgUrl, // ✅ 추가
}: ProfileCardProps) {
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate('/chat')}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300"
            >
              채팅방 이동
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

        <div className="flex gap-2">
          <button
            onClick={() => setMode('client')}
            className={`px-3 py-1 text-sm rounded-full border ${
              mode === 'client' ? 'bg-red-400 text-white' : 'bg-white text-gray-700'
            }`}
          >
            클라이언트 모드
          </button>
          <button
            onClick={() => setMode('freelancer')}
            className={`px-3 py-1 text-sm rounded-full border ${
              mode === 'freelancer' ? 'bg-red-400 text-white' : 'bg-white text-gray-700'
            }`}
          >
            프리랜서 모드
          </button>
        </div>
      </div>
    </section>
  );
}
