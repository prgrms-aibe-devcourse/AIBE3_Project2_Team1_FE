import { useState } from 'react';

import Done from '../../assets/done.png';
import Favorite from '../../assets/favorite.png';
import Historical from '../../assets/Historical.png';
import Star from '../../assets/Star Half Empty.png';
import view from '../../assets/View.png';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('견적 요청');
  const [mode, setMode] = useState<'client' | 'freelancer'>('client');

  const tabs = [
    { label: '진행 중인 프로젝트', icon: Historical },
    { label: '견적 요청', icon: view },
    { label: '완료된 프로젝트', icon: Done },
    { label: '관심 프리랜서', icon: Favorite },
    { label: '내가 쓴 리뷰', icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white relative">
        <div className="w-20" />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="text-rose-500 font-bold text-4xl">Pickple</div>
        </div>
        <div className="flex gap-2 text-gray-600 text-sm">
          <button className="hover:text-gray-800">로그인</button>
          <span>|</span>
          <button className="hover:text-gray-800">회원가입</button>
        </div>
      </header>

      {/* 프로필 */}
      <section className="max-w-4xl w-full mx-auto mt-6 p-6 bg-white rounded-lg border">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-300" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">홍길동</h2>
              {/* 회원정보 수정 버튼 */}
              <button className="px-3 py-1 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300 whitespace-nowrap">
                회원정보 수정
              </button>
              <button className="px-3 py-1 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm hover:bg-gray-300 whitespace-nowrap">
                로그아웃
              </button>
            </div>
            <p className="text-gray-500 text-sm">ddkk@ukuk.com</p>
            <p className="mt-1 text-sm text-gray-600">열심히 하는 프리랜서가 되겠습니다!</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>
                완료한 의뢰 <b className="text-black">14건</b>
              </span>
              <span>
                진행 중인 의뢰 <b className="text-black">3건</b>
              </span>
            </div>
          </div>

          {/* 모드 */}
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

      {/* 탭 */}
      <nav className="max-w-4xl w-full mx-auto mt-6 flex justify-between border-b">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 ${
              activeTab === tab.label
                ? 'text-teal-500 border-b-2 border-teal-500 font-medium'
                : 'text-gray-500'
            }`}
          >
            <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 내용 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full mt-10" />
        <p className="mt-6 text-gray-600">견적 요청이 없습니다</p>
        <button className="mt-4 px-6 py-2 rounded-full bg-red-400 text-white hover:bg-red-500">
          견적 요청하기
        </button>
      </main>
    </div>
  );
}
