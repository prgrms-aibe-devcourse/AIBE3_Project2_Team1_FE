import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Users, Clock } from 'lucide-react';

interface ChatRoom {
  chatRoomId: number;
  title: string;
  createdAt: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
}

export default function ChatRoomListPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/chatrooms');
      const data = await response.json();
      setChatRooms(data);
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const createChatRoom = async () => {
    if (!newRoomName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/v1/chatrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newRoomName }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewRoomName('');
        await fetchChatRooms();
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const handleRoomClick = (roomId: number) => {
    window.location.href = `/chat/${roomId}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#1ABC9C' }}
          ></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E0F5F1' }}
            >
              <MessageSquare className="w-6 h-6" style={{ color: '#1ABC9C' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">채팅방</h1>
              <p className="text-sm text-gray-500">{chatRooms.length}개의 대화</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium"
            style={{ backgroundColor: '#1ABC9C' }}
          >
            <Plus className="w-5 h-5" />새 채팅방
          </button>
        </div>

        {/* 채팅방 목록 */}
        <div className="space-y-3">
          {chatRooms.map((room) => (
            <div
              key={room.chatRoomId}
              onClick={() => handleRoomClick(room.chatRoomId)}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E0F5F1' }}
                >
                  <Users className="w-7 h-7" style={{ color: '#1ABC9C' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{room.title}</h3>
                  {/* 마지막 메시지 미리보기 */}
                  <p className="text-sm text-gray-600 truncate">
                    {room.lastMessage ?? '메시지가 없습니다'}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(room.lastMessageTime ?? room.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(room.createdAt)}</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}

          {chatRooms.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">아직 참여한 채팅방이 없습니다</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2 text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#1ABC9C' }}
              >
                첫 채팅방 만들기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 채팅방 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">새 채팅방 만들기</h3>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="채팅방 이름을 입력하세요"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void createChatRoom(); // Promise 경고 해결
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoomName('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => void createChatRoom()}
                disabled={creating}
                className="px-5 py-2 text-white rounded-lg transition-colors font-medium disabled:bg-gray-300"
                style={{ backgroundColor: creating ? undefined : '#1ABC9C' }}
              >
                {creating ? '생성 중...' : '생성하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
