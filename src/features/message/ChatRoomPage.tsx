import { AuthContext } from '@/features/auth/auth';
import { useChatRoom } from '@/features/message/useChatRoom';
import { axiosInstance } from '@/services/axios';
import axios from 'axios';
import { ArrowLeft, LogOut, MoreVertical, Send, Trash2 } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// localStorage에서 userId 가져오는 헬퍼 함수
const getUserId = () => {
  const userIdStr = localStorage.getItem('userId');
  return userIdStr ? parseInt(userIdStr, 10) : null;
};

function getSenderId(m: unknown): number | null {
  if (typeof m !== 'object' || m === null) return null;

  const obj = m as Record<string, unknown>;

  if ('senderUserId' in obj && typeof obj.senderUserId === 'number') return obj.senderUserId;
  if ('senderId' in obj && typeof obj.senderId === 'number') return obj.senderId;
  if ('userId' in obj && typeof obj.userId === 'number') return obj.userId;

  if ('sender' in obj && typeof obj.sender === 'object' && obj.sender !== null) {
    const s = obj.sender as Record<string, unknown>;
    if ('userId' in s && typeof s.userId === 'number') return s.userId;
    if ('id' in s && typeof s.id === 'number') return s.id;
  }
  return null;
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();
  const roomId = Number(roomIdParam); // ← 문자열을 숫자로

  // roomId가 숫자가 아니면 리스트로 돌려보내기 (안전가드)
  useEffect(() => {
    if (!roomId || Number.isNaN(roomId)) {
      navigate('/chat');
    }
  }, [roomId, navigate]);
  const { user } = useContext(AuthContext);
  // AuthContext의 user가 있으면 사용, 없으면 localStorage 사용
  const currentUserId = user?.id ?? getUserId();

  const { messages, loading, sendMessage, deleteMessage } = useChatRoom(roomId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false); //  메뉴 표시 상태
  const [otherUserName, setOtherUserName] = useState('채팅 상대'); //  상대방 이름
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 projectId 가져오기
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('projectId');

  // 마지막으로 언급된 projectId 추적
  const [lastMentionedProjectId, setLastMentionedProjectId] = useState<string | null>(null);

  //  메시지에서 상대방 이름 추출
  useEffect(() => {
    if (messages.length > 0 && currentUserId) {
      const otherMessage = messages.find((m) => m.senderUserId !== currentUserId);
      if (otherMessage?.senderName) {
        setOtherUserName(otherMessage.senderName);
      }
    }
  }, [messages, currentUserId]);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 새 메시지 올 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  // 컴포넌트 마운트 시 URL의 projectId로 시스템 메시지 전송
  useEffect(() => {
    if (projectIdFromUrl && projectIdFromUrl !== lastMentionedProjectId && !loading) {
      sendProjectContextMessage(projectIdFromUrl);
      setLastMentionedProjectId(projectIdFromUrl);
    }
  }, [projectIdFromUrl, loading]);

  // 프로젝트 컨텍스트 시스템 메시지 전송
  const sendProjectContextMessage = async (projectId: string) => {
    try {
      await sendMessage(` 프로젝트 #${projectId}에 대해 문의합니다`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await sendMessage(newMessage);
      setNewMessage('');
    } catch {
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };
  //  채팅방 나가기
  const handleLeaveChatRoom = async () => {
    if (!confirm('정말 채팅방을 나가시겠습니까?')) return;

    try {
      await axiosInstance.post(`/chatrooms/${roomId}/leave`);

      alert('채팅방을 나갔습니다.');
      navigate('/chat'); // ✅ 채팅방 리스트로 이동
    } catch (error: unknown) {
      console.error('채팅방 나가기 실패:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 필요합니다.');
        } else {
          alert(error.response?.data?.message ?? '채팅방 나가기에 실패했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const isSystemMessage = (content: string) => {
    return content.startsWith(' 프로젝트 #');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#1ABC9C' }}
          ></div>
          <p className="text-gray-600">채팅방 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="채팅 목록으로"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* 상대방 프로필 */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#E0F5F1' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#1ABC9C' }}>
                {otherUserName?.[0] ?? '?'}
              </span>
            </div>

            {/* 상대방 이름 */}
            <div>
              <h1 className="font-semibold text-gray-900">{otherUserName}</h1>
              <p className="text-xs text-gray-500">실시간 대화</p>
            </div>
          </div>

          {/* 메뉴 버튼 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleLeaveChatRoom}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  채팅방 나가기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isMyMessage = getSenderId(message) === currentUserId;
            const isSystem = isSystemMessage(message.content);

            // 시스템 메시지 UI
            if (isSystem) {
              return (
                <div key={message.messageId} className="flex justify-center my-4">
                  <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                    <p className="text-sm text-blue-700 font-medium">{message.content}</p>
                  </div>
                </div>
              );
            }
            //일반 메세지
            return (
              <div
                key={message.messageId}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-lg ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                  {/* 프로필 (상대) */}
                  {!isMyMessage && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E0F5F1' }}
                    >
                      <span className="text-xs font-semibold" style={{ color: '#1ABC9C' }}>
                        {message.senderName?.[0] ?? '?'}
                      </span>
                    </div>
                  )}

                  <div className={isMyMessage ? 'text-right' : ''}>
                    {/* 이름 (상대) */}
                    {!isMyMessage && (
                      <p className="text-xs text-gray-600 mb-1 ml-1">{message.senderName}</p>
                    )}

                    {/* 메시지 박스 */}
                    <div className="flex items-end gap-2">
                      {isMyMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                      )}

                      <div className="relative group">
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMyMessage
                              ? 'text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                          style={isMyMessage ? { backgroundColor: '#1ABC9C' } : {}}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>

                        {/* 삭제 버튼 (내 메시지만) */}
                        {isMyMessage && (
                          <button
                            onClick={() => void deleteMessage(message.messageId)}
                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 bg-white border border-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>

                      {!isMyMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSendMessage(); // Promise 경고 해결
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            disabled={sending}
          />
          <button
            onClick={() => void handleSendMessage()}
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 text-white rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ backgroundColor: sending || !newMessage.trim() ? undefined : '#1ABC9C' }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
