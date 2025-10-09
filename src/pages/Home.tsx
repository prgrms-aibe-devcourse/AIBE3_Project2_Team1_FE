import React from 'react';
import { Link } from 'react-router-dom';
import illustrationImg from '../assets/images/Rectangle.png';
import circleChartImg from '../assets/images/Circle Chart.png';
import codeImg from '../assets/images/Code.png';
import debtImg from '../assets/images/Debt.png';
import designImg from '../assets/images/Design.png';
import languageImg from '../assets/images/Language.png';
import rocketImg from '../assets/images/Rocket.png';
import videoCallImg from '../assets/images/Video Call.png';
import xBoxControllerImg from '../assets/images/Xbox Controller.png';

export default function Home() {
  const categories = [
    { id: 'video', name: '영상/사진/음향', icon: videoCallImg },
    { id: 'write', name: '문서/글쓰기', icon: designImg },
    { id: 'it', name: 'IT/프로그래밍', icon: codeImg },
    { id: 'marketing', name: '마케팅', icon: circleChartImg },
    { id: 'hobby', name: '취미 레슨', icon: xBoxControllerImg },
    { id: 'tax', name: '세무/법무/노무', icon: debtImg },
    { id: 'startup', name: '창업/사업', icon: rocketImg },
    { id: 'translate', name: '번역/통역', icon: languageImg },
  ];

  const freelancers = Array(4).fill({
    name: '전국 출장 음식사진 전문',
    studio: '스튜디오포트힙',
    price: '140,000원~',
    rating: '⭐ 4.6 (1,222)',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex items-center justify-between bg-[#1ABC9C] px-[80px] py-[40px]">
        {/* 왼쪽 이미지 */}
        <img src={illustrationImg} alt="illustration" className="w-[450px] mr-10" />

        {/* 오른쪽 텍스트 */}
        <div className="text-right max-w-[500px]">
          <h1 className="text-5xl font-bold mb-4 text-[#f2f2f2]">프리랜서와 기업을</h1>
          <h1 className="text-5xl font-bold text-[#f2f2f2] mb-4">
            <span className="text-[#FF6b6b]">한 곳</span>에서 연결
          </h1>
          <p className="text-gray-600 mb-6 text-[#f2f2f2] text-[18px]">
            당신의 프로젝트를 최고 <br />
            맞춤형 파트너와 시작하세요.
          </p>
          <div className="flex gap-3  justify-end">
            <Link
              to="/project/write"
              className="bg-[#ff6b6b] hover:bg-[#f56767] text-white px-6 py-2 rounded-[12px] font-semibold"
            >
              프로젝트 등록
            </Link>
            <Link
              to="/projects/client"
              className="bg-white border border-emerald-400 text-emerald-500 hover:bg-emerald-50 px-6 py-2 rounded-[12px] font-semibold"
            >
              프로젝트 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="flex justify-center gap-10 py-10 border-b">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center text-sm text-gray-700 hover:text-emerald-500 cursor-pointer"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-2">
              <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
            </div>
            <span>{cat.name}</span>
          </div>
        ))}
      </section>

      {/* 인기 프리랜서 */}
      <section className="px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            픽플 <span className="text-emerald-500">인기</span> 프리랜서
          </h2>
          <button className="text-sm text-gray-500 hover:text-emerald-500">전체 보기 &gt;</button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {freelancers.map((f, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="w-full h-36 bg-gray-200 rounded-md mb-3"></div>
              <p className="text-sm font-semibold mb-1">{f.name}</p>
              <p className="text-xs text-gray-500 mb-1">{f.rating}</p>
              <p className="text-sm font-semibold text-emerald-600 mb-1">{f.price}</p>
              <p className="text-xs text-gray-400">{f.studio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 신입 프리랜서 */}
      <section className="px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            픽플 <span className="text-emerald-500">신입</span> 프리랜서
          </h2>
          <button className="text-sm text-gray-500 hover:text-emerald-500">전체 보기 &gt;</button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {freelancers.map((f, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="w-full h-36 bg-gray-200 rounded-md mb-3"></div>
              <p className="text-sm font-semibold mb-1">{f.name}</p>
              <p className="text-xs text-gray-500 mb-1">{f.rating}</p>
              <p className="text-sm font-semibold text-emerald-600 mb-1">{f.price}</p>
              <p className="text-xs text-gray-400">{f.studio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI 추천 */}
      <section className="px-20 py-10 bg-gray-50">
        <h2 className="text-lg font-bold mb-6">
          <span className="text-emerald-500">_님 맞춤</span> AI 추천
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {freelancers.slice(0, 2).map((f, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
              <div className="w-full h-36 bg-gray-200 rounded-md mb-3"></div>
              <p className="text-sm font-semibold mb-1">{f.name}</p>
              <p className="text-xs text-gray-500 mb-1">{f.rating}</p>
              <p className="text-sm font-semibold text-emerald-600 mb-1">{f.price}</p>
              <p className="text-xs text-gray-400">{f.studio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
