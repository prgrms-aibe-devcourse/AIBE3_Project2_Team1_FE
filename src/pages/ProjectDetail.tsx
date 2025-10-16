import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProjectInfo from '../features/project/ProjectInfo';
import ServiceInfo from '../features/project/ServiceInfo';
import ProjectReview from '../features/project/ProjectReview';
import { categoryGroups } from '@/features/project/constants/categories';
import api from '../features/project/api';
import axios from 'axios';

interface ProjectImage {
  id: number;
  fileUrl: string;
}

interface ProjectDetailResponse {
  projectId: number;
  initiatorNickname: string;
  participantNickname: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  groupType: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  milestoneId?: number; // 마일스톤 ID 추가
  imageUrls?: ProjectImage[];
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'service' | 'review'>('service');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '전체';
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    const group = categoryGroups.find((g) => g.groupId === groupId);
    const foundCategory = group?.categories.find(
      (c) => c.id.toLowerCase() === categoryId.toLowerCase()
    );
    return foundCategory ? foundCategory.name : '전체';
  };

  // 로그인 유저 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/users/info');
        setCurrentUserNickname(res?.data?.data?.nickname ?? null);
      } catch {
        setCurrentUserNickname(null);
      }
    };
    fetchUserInfo();
  }, []);

  // 프로젝트 상세 불러오기
  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const res = await api.get(`/projects/${projectId}`);
        const payload = res?.data?.data ?? res?.data ?? null;
        setProject(payload);
      } catch {
        setError('프로젝트 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetail();
  }, [projectId]);

  // 프로젝트 참여자일 경우 마일스톤 페이지로 자동 이동
  useEffect(() => {
    if (!project || !currentUserNickname) return;

    const isParticipant =
      currentUserNickname === project.initiatorNickname ||
      currentUserNickname === project.participantNickname;

    if (isParticipant) {
      // 마일스톤 ID가 없으면 프로젝트 ID로 조회 후 이동
      const moveToMilestone = async () => {
        try {
          let milestoneId = project.milestoneId;
          if (!milestoneId) {
            const res = await api.get(`/milestones/project/${project.projectId}`);
            milestoneId = res?.data?.data?.milestoneId;
          }
          if (milestoneId) {
            navigate(`/milestone/${milestoneId}`);
          }
        } catch (e) {
          console.error('마일스톤 이동 실패:', e);
        }
      };

      moveToMilestone();
    }
  }, [project, currentUserNickname, navigate]);

  // 삭제
  const handleDelete = async () => {
    if (!projectId) return;
    const confirmed = window.confirm('정말 이 프로젝트를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await api.delete(`/projects/${projectId}`);
      alert('프로젝트가 삭제되었습니다.');
      navigate('/projects/client');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(`삭제 실패: ${err.response?.data?.message || '서버 오류'}`);
      } else {
        alert('서버 연결 오류가 발생했습니다.');
      }
    } finally {
      setDeleting(false);
    }
  };

  // 작성자 여부
  const isAuthor =
    currentUserNickname &&
    project?.initiatorNickname?.toLowerCase().trim() === currentUserNickname.toLowerCase().trim();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
    );
  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        프로젝트를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 경로 */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/projects/${type === 'freelancer' ? 'freelancer' : 'client'}`)}
            className="px-2 font-semibold text-[24px] text-[#666666] hover:underline"
          >
            {type === 'freelancer' ? '프리랜서' : '클라이언트'}
          </button>
          <span className="mx-1 text-[28px] text-[#666666]">›</span>
          <button
            onClick={() => {
              const groupId = type === 'freelancer' ? 'freelancer' : 'client';
              const categoryId = category || 'all';
              navigate(`/projects/${groupId}/${categoryId}`);
            }}
            className="px-2 font-semibold text-[24px] text-[#666666] hover:underline"
          >
            {getCategoryName(project.category || category)}
          </button>
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <ProjectInfo
        project={{
          project_id: project.projectId,
          title: project.title,
          description: project.description,
          budget: project.budget,
          author: project.initiatorNickname,
          rating: 0,
          reviews: 0,
          groupId: type === 'freelancer' ? 'freelancer' : 'client',
          categoryId: project.category,
        }}
      />

      {/* 탭 */}
      <div className="flex gap-4 p-4 max-w-6xl mx-auto font-medium text-[20px]">
        <button
          className={`py-2 rounded ${activeTab === 'service' ? 'text-[#2c2c2c]' : 'text-[#666666]'}`}
          onClick={() => setActiveTab('service')}
        >
          서비스 설명
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'review' ? 'text-[#2c2c2c]' : 'text-[#666666]'}`}
          onClick={() => setActiveTab('review')}
        >
          리뷰
        </button>
      </div>

      <hr className="border-t border-gray-300 max-w-6xl mx-auto" />

      {/* 탭 내용 */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'service' ? (
          <ServiceInfo
            project={{
              projectId: project.projectId,
              title: project.title,
              description: project.description,
              category: getCategoryName(project.category),
              budget: project.budget,
              deadline: project.deadline,
              client: project.initiatorNickname,
              freelancer: project.participantNickname,
              status: project.status,
              imageUrls: project.imageUrls,
            }}
            currentUserId={currentUserNickname ?? undefined}
          />
        ) : (
          <ProjectReview />
        )}
      </div>

      {/* 마일스톤 이동 */}
      {(currentUserNickname === project.initiatorNickname ||
        currentUserNickname === project.participantNickname) && (
        <div className="max-w-6xl mx-auto flex justify-center mt-8 mb-16">
          <button
            onClick={async () => {
              try {
                let milestoneId = project.milestoneId;
                if (!milestoneId) {
                  const res = await api.get(`/milestones/project/${project.projectId}`);
                  milestoneId = res?.data?.data?.milestoneId;
                }
                if (milestoneId) {
                  navigate(`/milestone/${milestoneId}`);
                } else {
                  alert('마일스톤 정보를 찾을 수 없습니다.');
                }
              } catch (error) {
                console.error('마일스톤 이동 실패:', error);
                alert('마일스톤 페이지로 이동하는 중 오류가 발생했습니다.');
              }
            }}
            className="px-8 py-3 text-lg font-semibold text-white rounded-xl shadow-md bg-[#1ABC9C] hover:bg-[#1EB194]"
          >
            마일스톤 페이지로 이동
          </button>
        </div>
      )}

      {/* 작성자용 수정/삭제 버튼 */}
      {isAuthor && (
        <div className="max-w-6xl mx-auto flex justify-center gap-6 mt-8 mb-32 px-6">
          <button
            onClick={() => navigate(`/project/${projectId}/update`)}
            className="px-8 py-3 text-lg font-semibold text-white rounded-xl shadow-md bg-[#1ABC9C] hover:bg-[#1EB194]"
          >
            프로젝트 수정
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`px-8 py-3 text-lg font-semibold text-white rounded-xl shadow-md transition-all duration-200
              ${deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff5b5b] hover:bg-[#ff3b3b]'}`}
          >
            {deleting ? '삭제 중...' : '프로젝트 삭제'}
          </button>
        </div>
      )}
    </div>
  );
}
