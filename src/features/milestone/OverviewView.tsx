import { useState } from 'react';
import TabNavigation from './components/TabNavigation';

export default function OverviewView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('프로젝트의 상세 내용을 적습니다.');

  return (
    <>
      {/* 프로젝트 제목 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">전국 출장 음식사진 전문</h1>
        </div>
      </div>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">프로젝트 디테일</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                {editMode ? '저장' : '수정'}
              </button>
            </div>
            {editMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-600">{description}</p>
            )}
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">팀원</h2>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
