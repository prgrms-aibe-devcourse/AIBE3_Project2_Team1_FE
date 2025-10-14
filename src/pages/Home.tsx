import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../features/project/api';
import ProjectCard from '../features/project/ProjectCard';
import illustrationImg from '../assets/images/Rectangle.png';
import circleChartImg from '../assets/images/Circle Chart.png';
import codeImg from '../assets/images/Code.png';
import debtImg from '../assets/images/Debt.png';
import designImg from '../assets/images/Design.png';
import languageImg from '../assets/images/Language.png';
import rocketImg from '../assets/images/Rocket.png';
import videoCallImg from '../assets/images/Video Call.png';
import xBoxControllerImg from '../assets/images/Xbox Controller.png';
import { categoryGroups } from '@/features/project/constants/categories';

// ✅ 카테고리 아이콘 매핑
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

// ✅ Project 타입 정의
interface Project {
  project_id: number;
  title: string;
  budget: number;
  author: string;
  rating: number;
  reviews: number;
  groupId: string;
  categoryId: string;
}

interface ProjectApiResponse {
  projectId: number;
  clientNickname: string;
  freelancerNickname?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  status: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recommended, setRecommended] = useState<Project[]>([]);

  // 프로젝트 불러오기 (로그인 여부와 무관)
  useEffect(() => {
    api
      .get('/projects')
      .then((res) => {
        console.table(res.data.data);
        const projectsData =
          (res.data.data as ProjectApiResponse[])?.map((p) => ({
            project_id: p.projectId,
            title: p.title,
            budget: p.budget,
            author: p.clientNickname,
            rating: 4.6,
            reviews: 120,
            groupId: 'client',
            categoryId: p.category || 'IT',
          })) || [];

        setProjects(projectsData);

        // AI 추천 (간단히 랜덤 4개)
        const shuffled = [...projectsData].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 4));
      })
      .catch((err) => console.error('프로젝트 불러오기 실패:', err));
  }, []);

  // 카테고리 목록
  const clientCategories = categoryGroups.find((g) => g.groupId === 'client')?.categories ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-[#1ABC9C] px-[80px] py-[40px]">
        <img src={illustrationImg} alt="illustration" className="w-[400px] mb-6 md:mb-0 md:mr-10" />

        <div className="text-right max-w-[500px]">
          <h1 className="text-5xl font-bold mb-4 text-[#f2f2f2]">프리랜서와 기업을</h1>
          <h1 className="text-5xl font-bold text-[#f2f2f2] mb-4">
            <span className="text-[#FF6b6b]">한 곳</span>에서 연결
          </h1>
          <p className="text-[#f2f2f2] mb-6 text-[18px] leading-relaxed">
            당신의 프로젝트를 최고 맞춤형 파트너와 시작하세요.
          </p>
          <div className="flex gap-3 justify-end">
            <Link
              to="/projects/write"
              className="bg-[#ff6b6b] hover:bg-[#f56767] text-white px-6 py-2 rounded-[12px] font-semibold transition-all"
            >
              프로젝트 등록
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
          .map((cat) => {
            console.log(cat.id);
            return (
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
            );
          })}
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
            projects.slice(0, 4).map((p) => {
              console.log(p.project_id);
              return (
                <ProjectCard
                  key={p.project_id}
                  project_id={p.project_id}
                  title={p.title}
                  budget={p.budget}
                  author={p.author}
                  rating={p.rating}
                  reviews={p.reviews}
                  groupId={p.groupId}
                  categoryId={p.categoryId}
                />
              );
            })
          ) : (
            <p className="text-gray-400 col-span-4 text-center">등록된 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>

      {/* AI 추천 프로젝트 섹션 */}
      <section className="px-20 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            AI 추천 <span className="text-emerald-500">프로젝트</span>
          </h2>
          <span className="text-sm text-gray-500">당신이 관심 가질 만한 프로젝트</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.length > 0 ? (
            recommended.map((p) => (
              <ProjectCard
                key={`rec-${p.project_id}`}
                project_id={p.project_id}
                title={p.title}
                budget={p.budget}
                author={p.author}
                rating={p.rating}
                reviews={p.reviews}
                groupId={p.groupId}
                categoryId={p.categoryId}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-4 text-center">추천할 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
