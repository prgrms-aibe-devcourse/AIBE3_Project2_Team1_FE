import { useNavigate } from 'react-router-dom';
import favoriteImg from '../../assets/images/Favorite.png';
import starImg from '../../assets/images/fluent-color_star-16.png';
import bookmarkImg from '../../assets/images/material-symbols_bookmark-outline.png';

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

interface Profile {
  profile_id: number;
  user_id: number;
  title: string;
  description: string;
  skills: string[];
  hourly_rate: number;
  imageUrl?: string;
}

interface Favorite {
  favorite: number;
}

interface ProjectInfoProps {
  project: Project;
  profile: Profile;
  favorite: Favorite;
}

export default function ProjectInfo({ project, profile, favorite }: ProjectInfoProps) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* 프로젝트 제목 */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <button onClick={goHome}>
          <img src={bookmarkImg} alt="bookmark" className="w-8 h-8 cursor-pointer" />
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto bg-white rounded-[20px] border-[3px] border-[#1ABC9C] relative">
        {/* 프로필 */}
        <div className="flex items-center gap-4 mb-4">
          {/* 프로필 이미지 */}
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt="프로필"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              없음
            </div>
          )}

          {/* 프로필 제목 + 즐겨찾기 */}
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">{profile.title}</div>
            <div className="flex items-center gap-0.5">
              <img src={favoriteImg} alt="favorite" className="w-7 h-5" />
              <span className="text-[#666666] text-sm">{favorite.favorite}</span>
            </div>
          </div>

          {/* 문의하기 버튼 */}
          <button
            onClick={goHome}
            className="ml-auto bg-[#D9D9D9] rounded-[12px] px-4 py-2 text-[#2C2C2C] font-semibold hover:bg-[#c5c5c5] transition"
          >
            문의하기
          </button>
        </div>

        {/* 리뷰 */}
        <div className="flex items-center gap-1 mb-4">
          <img src={starImg} alt="star" className="w-6 h-6" />
          <span>
            {project.rating.toFixed(1)} ({project.reviews})
          </span>
        </div>

        {/* 스킬 목록 */}
        <div>
          <h3 className="font-semibold mb-2">보유 스킬</h3>
          <div className="flex gap-2 flex-wrap">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 매칭 제안하기 버튼 */}
        <button
          onClick={goHome}
          className="absolute bottom-4 right-4 bg-[#FF6B6B] rounded-[12px] px-4 py-2 text-[#F2F2F2] font-semibold hover:bg-[#ff4b4b] transition"
        >
          매칭 제안하기
        </button>
      </div>
    </>
  );
}
