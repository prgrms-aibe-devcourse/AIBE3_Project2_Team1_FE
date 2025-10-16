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
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // 카테고리명 변환 함수
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '전체';
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    const group = categoryGroups.find((g) => g.groupId === groupId);
    const foundCategory = group?.categories.find(
      (c) => c.id.toLowerCase() === categoryId.toLowerCase()
    );
    return foundCategory ? foundCategory.name : '전체';
  };

  // 내 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/users/info');
        const nickname = res?.data?.data?.nickname ?? null;
        setCurrentUserNickname(nickname);
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

  // 프로젝트 상태 변경 핸들러
  const handleStatusChange = async (newStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => {
    if (!projectId) return;
    const confirmed = window.confirm(`프로젝트 상태를 '${newStatus}'로 변경하시겠습니까?`);
    if (!confirmed) return;

    try {
      setUpdatingStatus(true);
      await api.patch(`/projects/${projectId}/status`, { status: newStatus });
      alert('프로젝트 상태가 변경되었습니다.');
      setProject((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(`상태 변경 실패: ${err.response?.data?.message || '서버 오류'}`);
      } else {
        alert('서버 연결 오류가 발생했습니다.');
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 삭제 버튼 핸들러
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

  // 로그인 유저가 클라이언트 또는 프리랜서인지 판별
  const isParticipant =
    currentUserNickname &&
    (currentUserNickname === project?.initiatorNickname ||
      currentUserNickname === project?.participantNickname);

  // 작성자 여부 판단
  const isAuthor =
    currentUserNickname &&
    project?.initiatorNickname?.toLowerCase().trim() === currentUserNickname.toLowerCase().trim();

  // 로딩/에러 상태 처리
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
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/projects/${type === 'freelancer' ? 'freelancer' : 'client'}`)}
            className="px-2 font-semibold text-[24px] text-[#666666] hover:underline hover:decoration-[#666666]"
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
            className="px-2 font-semibold text-[24px] text-[#666666] hover:underline hover:decoration-[#666666]"
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
          className={`py-2 rounded ${
            activeTab === 'service' ? 'text-[#2c2c2c]' : 'text-[#666666]'
          }`}
          onClick={() => setActiveTab('service')}
        >
          서비스 설명
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'review' ? 'text-[#2c2c2c]' : 'text-[#666666]'
          }`}
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
              status:
                project.status === 'OPEN' ||
                project.status === 'IN_PROGRESS' ||
                project.status === 'COMPLETED'
                  ? project.status
                  : 'OPEN',
              imageUrls: project.imageUrls || [],
              status: project.status,
              // ServiceInfo expects ProjectImage[] (objects with id and fileUrl).
              // The API returns string[] (URLs) so map them to ProjectImage objects here.
              imageUrls: project.imageUrls ?? [],
            }}
            currentUserId={currentUserNickname ?? undefined}
          />
        ) : (
          <ProjectReview />
        )}
      </div>

      {/* 상태 변경 버튼 - 참여자만 표시 */}
      {isParticipant && (
        <div className="max-w-6xl mx-auto flex justify-center gap-4 mt-10 mb-20">
          {project.status !== 'OPEN' && (
            <button
              onClick={() => handleStatusChange('OPEN')}
              disabled={updatingStatus}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md"
            >
              OPEN으로 변경
            </button>
          )}
          {project.status !== 'IN_PROGRESS' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={updatingStatus}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold shadow-md"
            >
              진행 중으로 변경
            </button>
          )}
          {project.status !== 'COMPLETED' && (
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={updatingStatus}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold shadow-md"
            >
              완료로 변경
            </button>
          )}
        </div>
      )}

      {/* 작성자만 볼 수 있는 수정/삭제 버튼 */}
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
