import { useNavigate } from 'react-router-dom';
import starImg from '../../assets/images/fluent-color_star-16.png';
import bookmarkEmptyImg from '../../assets/images/material-symbols_bookmark-outline.png';
import bookmarkFullImg from '../../assets/images/material-symbols_bookmark.png';
import { useState, useEffect } from 'react';
import api from '../project/api';

interface Project {
  project_id: number;
  title: string;
  description: string;
  budget: number;
  author: string;
  rating: number;
  reviews: number;
  groupId: string;
  categoryId: string;
}

interface ProjectDetail {
  projectId: number;
  initiatorNickname: string;
  participantNickname: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  status: string;
}

export default function ProjectInfo({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchProjectAndBookmark = async () => {
      try {
        const projectRes = await api.get(`/projects/${project.project_id}`);
        setProjectDetail(projectRes.data.data);

        const bookmarksRes = await api.get('/bookmarks');
        const isBookmarked = bookmarksRes.data.data.some(
          (b: { projectId: number }) => b.projectId === project.project_id
        );
        setBookmarked(isBookmarked);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };

    fetchProjectAndBookmark();
  }, [project.project_id]);

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${project.project_id}`);
      } else {
        await api.post(`/bookmarks/${project.project_id}`);
      }
      setBookmarked((prev) => !prev);
    } catch (err) {
      console.error('북마크 처리 실패:', err);
    }
  };

  const goHome = () => navigate('/');

  const goHProposal = () => {
    if (project.groupId === 'client') {
      navigate(`/project/${project.project_id}/client-proposal`);
    } else {
      navigate(`/project/${project.project_id}/freelancer-proposal`);
    }
  };

  if (!projectDetail)
    return <div className="p-6 text-center text-gray-500">프로젝트 정보를 불러오는 중...</div>;

  return (
    <>
      {/* 제목 + 북마크 */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <h2 className="text-2xl font-bold">{projectDetail.title}</h2>
        <button onClick={toggleBookmark}>
          <img
            src={bookmarked ? bookmarkFullImg : bookmarkEmptyImg}
            alt="bookmark"
            className="w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-110"
          />
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto bg-white rounded-[20px] border-[3px] border-[#1ABC9C] relative">
        {/* 작성자 정보 + 문의하기 */}
        <div className="flex items-center gap-4 mb-2">
          <div className="text-[22px] font-semibold text-gray-800">
            {projectDetail.initiatorNickname}
          </div>

          <button
            onClick={goHome}
            className="ml-auto bg-[#D9D9D9] rounded-[12px] px-4 py-2 text-[#2C2C2C] font-semibold hover:bg-[#c5c5c5] transition"
          >
            문의하기
          </button>
        </div>

        {/* 설명 */}
        <p className="text-[18px] text-gray-700 mb-2">{projectDetail.description}</p>

        {/* 기본 정보 */}
        <div className="space-y-2 mb-6 text-gray-600">
          <div>카테고리: {projectDetail.category}</div>
        </div>

        {/* 리뷰 */}
        <div className="flex items-center gap-1 mb-4">
          <img src={starImg} alt="star" className="w-6 h-6" />
          <span>
            {project.rating.toFixed(1)} ({project.reviews})
          </span>
        </div>

        {/* 매칭 제안 버튼 */}
        <button
          onClick={goHProposal}
          className="absolute bottom-4 right-4 bg-[#FF6B6B] rounded-[12px] px-4 py-2 text-[#F2F2F2] font-semibold hover:bg-[#ff4b4b] transition"
        >
          매칭 제안하기
        </button>
      </div>
    </>
  );
}
