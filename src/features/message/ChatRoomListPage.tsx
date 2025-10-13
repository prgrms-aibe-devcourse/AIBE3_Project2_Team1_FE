import { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    void fetchChatRooms();
  }, []);

  const authHeaders = (): HeadersInit => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/chatrooms/my-chatrooms', {
        headers: authHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('인증 실패 - 로그인이 필요합니다');
          // 로그인 페이지로 리다이렉트 (옵션)
          // navigate('/login');
          throw new Error('인증이 필요합니다');
        }
        throw new Error('Failed to fetch chatrooms');
      }

      const result = await response.json();
      const data: ChatRoom[] = result?.data ?? result ?? [];
      setChatRooms(data);
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso?: string | null, fallback?: string) => {
    const src = iso || fallback;
    if (!src) return '';

    try {
      const date = new Date(src);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;
      return date.toLocaleDateString('ko-KR');
    } catch {
      return '';
    }
  };

  const handleRoomClick = (roomId: number) => {
    navigate(`/chat/${roomId}`);
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(room.lastMessageTime, room.createdAt)}</span>
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
              <h3 className="text-lg font-semibold mb-2">문의할 상대를 찾아보세요!</h3>
              <p className="text-gray-500 mb-4">
                프로젝트/프로필 상세에서 &ldquo;문의하기&rdquo;를 누르면 1:1 채팅방이 자동으로
                생성돼요.
              </p>
              <button
                onClick={() => {
                  window.location.href = '/projects/:groupId';
                }}
                className="px-5 py-2 text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#1ABC9C' }}
              >
                프로젝트 둘러보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
