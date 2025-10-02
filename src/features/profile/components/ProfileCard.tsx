import type { ProfileCardProps } from '../types';

export default function ProfileCard({
  mode,
  setMode,
  name,
  email,
  bio,
  completedCount,
  inProgressCount,
}: ProfileCardProps) {
  return (
    <section className="max-w-4xl w-full mx-auto mt-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{name || '알수 없음'}</h2>
            <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300">
              회원정보 수정
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300">
              로그아웃
            </button>
          </div>
          <p className="text-gray-500 text-sm">{email}</p>
          <p className="mt-1 text-sm text-gray-600">{bio}</p>
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
