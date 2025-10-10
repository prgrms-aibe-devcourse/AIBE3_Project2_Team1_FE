import { useState, useRef } from 'react';
import { Pencil, Check } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import KanbanView from './views/KanbanView.tsx';
import CalendarView from './views/CalendarView';
import FilesView from '@/features/milestone/views/FilesView.tsx';

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
}

export default function OverviewView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('프로젝트의 상세 내용을 적습니다.');
  const [projectTitle, setProjectTitle] = useState('프로젝트 제목');
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '팀원 1', role: 'PM', avatar: null },
  ]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: `팀원 ${members.length + 1}`,
      role: '',
      avatar: null,
    };
    setMembers([...members, newMember]);
  };
  const deleteMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleAvatarChange = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMembers(
        members.map((m) => (m.id === memberId ? { ...m, avatar: reader.result as string } : m))
      );
    };
    reader.readAsDataURL(file);
  };

  const updateMember = (memberId: string, field: keyof Member, value: string) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, [field]: value } : m)));
  };
  const saveDescription = () => {
    // TODO: API 연동 시 저장 로직 추가
    console.log('저장:', description);
    setEditMode(false);
  };

  const saveMembers = () => {
    // TODO: API 연동 시 저장 로직 추가
    console.log('팀원 저장:', members);
    alert('팀원 정보가 저장되었습니다.');
  };
  const saveProjectTitle = () => {
    console.log('프로젝트 제목 저장:', projectTitle);
    setIsTitleEditing(false);
  };

  return (
    <>
      {/* 프로젝트 제목 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {isTitleEditing ? (
              <>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 focus:outline-none flex-1"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveProjectTitle();
                    }
                  }}
                />
                <button
                  onClick={saveProjectTitle}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title="저장"
                >
                  <Check className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{projectTitle}</h1>
                <button
                  onClick={() => setIsTitleEditing(true)}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title="제목 수정"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">프로젝트 디테일</h2>
                <button
                  onClick={editMode ? saveDescription : () => setEditMode(true)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">팀원</h2>
              <div className="flex gap-2">
                <button
                  onClick={saveMembers}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={addMember}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  + 팀원 추가
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="relative flex items-center gap-3 p-3 rounded-lg border border-gray-200"
                >
                  <button
                    onClick={() => fileInputRefs.current[member.id]?.click()}
                    className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-400">+</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <input
                      value={member.name}
                      onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-0 px-0 py-1 text-sm font-medium focus:outline-none"
                      placeholder="이름"
                    />
                    <input
                      value={member.role}
                      onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                      className="w-full bg-transparent border-0 px-0 py-1 text-sm text-gray-600 focus:outline-none"
                      placeholder="역할"
                    />
                  </div>

                  <button
                    onClick={() => deleteMember(member.id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="삭제"
                  >
                    ✕
                  </button>

                  <input
                    ref={(el) => {
                      fileInputRefs.current[member.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarChange(member.id, e)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kanban' && <KanbanView />}

        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'files' && <FilesView />}
      </div>
    </>
  );
}
