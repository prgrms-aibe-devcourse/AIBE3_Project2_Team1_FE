import { categoryGroups } from '@/features/project/constants/categories';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import circleChartImg from '../assets/images/Circle Chart.png';
import codeImg from '../assets/images/Code.png';
import debtImg from '../assets/images/Debt.png';
import designImg from '../assets/images/Design.png';
import designImage from '../assets/images/digital design program interface.png';
import languageImg from '../assets/images/Language.png';
import illustrationImg from '../assets/images/Rectangle.png';
import rocketImg from '../assets/images/Rocket.png';
import videoCallImg from '../assets/images/Video Call.png';
import xBoxControllerImg from '../assets/images/Xbox Controller.png';
import api from '../features/project/api';
import ProjectCard from '../features/project/ProjectCard';

const categoryIcons: Record<string, string> = {
  VIDEO: videoCallImg,
  WRITE: designImg,
  IT: codeImg,
  MARKETING: circleChartImg,
  HOBBY: xBoxControllerImg,
  TAX: debtImg,
  STARTUP: rocketImg,
  TRANSLATE: languageImg,
};

interface ProjectApiResponse {
  projectId: number;
  initiatorNickname: string;
  participantNickname?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  groupType: string;
  status: string;
  imageUrls?: { id: number; fileUrl: string }[];
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [recommended, setRecommended] = useState<ProjectApiResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 전체 프로젝트 불러오기
    api
      .get('/projects')
      .then((res) => {
        const projectsData = res.data?.data || [];
        setProjects(projectsData);
      })
      .catch((err) => console.error('프로젝트 불러오기 실패:', err));

    // 추천 프리랜서 프로젝트 불러오기
    api
      .get('/projects')
      .then((res) => {
        const projects = (res.data?.data || []) as ProjectApiResponse[];
        const freelancerProjects = projects.filter((p) => p.groupType === 'FREELANCER');
        const shuffled = freelancerProjects.sort(() => Math.random() - 0.5).slice(0, 4);
        setRecommended(shuffled);
      })
      .catch((err) => console.error('❌ 프리랜서 추천 프로젝트 불러오기 실패:', err));
  }, []);

  const clientCategories = categoryGroups.find((g) => g.groupId === 'client')?.categories ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="
      mx-auto mt-10
      flex flex-flex flex-col md:flex-row items-center justify-between
      bg-[#1ABC9C] px-[80px] py-[40px]
       shadow-lg overflow-hidden
    "
      >
        <img src={illustrationImg} alt="illustration" className="w-[400px] mb-6 md:mb-0 md:mr-10" />
        <div className="text-right max-w-[500px]">
          <h1 className="text-5xl font-bold mb-4 text-[#F2F2F2]">프리랜서와 기업을</h1>
          <h1 className="text-5xl font-bold text-[#F2F2F2] mb-4">
            <span className="text-[#FF6B6B]">한 곳</span>에서 연결
          </h1>
          <p className="text-[#F2F2F2] mb-6 text-[18px] leading-relaxed">
            당신의 프로젝트를 최고 맞춤형 파트너와 시작하세요.
          </p>

          <div className="flex gap-3 justify-end">
            <Link
              to="/project/write"
              className="bg-[#FF6B6B] hover:bg-[#F56767] text-white px-6 py-2 rounded-[12px] font-semibold transition-all"
            >
              프로젝트 생성
            </Link>
            <Link
              to="/projects/client"
              className="bg-white border border-emerald-400 text-emerald-500 hover:bg-emerald-50 px-6 py-2 rounded-[12px] font-semibold transition-all"
            >
              프로젝트 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="flex justify-center gap-10 py-10 border-b flex-wrap">
        {clientCategories
          .filter((cat) => cat.id !== 'ALL')
          .map((cat) => (
            <Link
              key={cat.id}
              to={`/projects/client/${cat.id}`}
              className="flex flex-col items-center text-sm text-gray-700 hover:text-emerald-500 cursor-pointer transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-2 shadow-sm hover:shadow-md">
                <img
                  src={categoryIcons[cat.id]}
                  alt={cat.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
      </section>

      {/* 추천 프리랜서 섹션 */}
      <section className="px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            픽플 <span className="text-[#FF6B6B]">추천</span> 프리랜서
          </h2>
          <Link to="/projects/freelancer" className="text-sm text-gray-500 hover:text-emerald-500">
            전체 보기 &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.length > 0 ? (
            recommended.map((p) => (
              <ProjectCard
                key={`rec-${p.projectId}`}
                projectId={p.projectId}
                title={p.title}
                budget={p.budget}
                initiatorNickname={p.initiatorNickname}
                category={p.category}
                groupType={p.groupType}
                imageUrls={p.imageUrls}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-4 text-center">추천할 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 최신 프로젝트 섹션 */}
      <section className="px-20 py-10 border-b">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            최근 등록된 <span className="text-emerald-500">프로젝트</span>
          </h2>
          <Link to="/projects/client" className="text-sm text-gray-500 hover:text-emerald-500">
            전체 보기 &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.length > 0 ? (
            projects
              .slice(0, 4)
              .map((p) => (
                <ProjectCard
                  key={p.projectId}
                  projectId={p.projectId}
                  title={p.title}
                  budget={p.budget}
                  initiatorNickname={p.initiatorNickname}
                  category={p.category}
                  groupType={p.groupType}
                  imageUrls={p.imageUrls}
                />
              ))
          ) : (
            <p className="text-gray-400 col-span-4 text-center">등록된 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 하단 CTA 섹션 */}
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-between rounded-2xl p-10 shadow-sm max-w-6xl mx-auto gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              <span className="border-l-4 border-gray-900 pl-4 block mb-6">
                손쉽게
                <br />
                프로젝트를
                <br />
                디자인
              </span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              카테고리와 설정을 입력하면
              <br />
              AI가 프로젝트를 구체적으로 구현해드립니다.
            </p>
            <button
              onClick={() => {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                  alert('로그인이 필요합니다.');
                  navigate('/login');
                  return;
                }
                navigate('/matching');
              }}
              className="mt-10 bg-black text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-gray-800 transition-all duration-300"
            >
              프로젝트 시작하기 →
            </button>
          </div>
          <div className="flex-1 flex justify-center relative">
            <img
              src={designImage}
              alt="디지털 디자인 프로그램 인터페이스"
              className="w-96 h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
