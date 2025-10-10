import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';

interface Message {
  messageId: number;
  senderUserId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

interface ChatRoomPageProps {
  roomId?: number;
}

export default function ChatRoomPage({ roomId = 1 }: ChatRoomPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId] = useState<number>(1); // setter 제거
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 메시지 목록 로드 (useCallback으로 의존성 충족)
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages/chatroom/${roomId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // SSE 연결
  useEffect(() => {
    const eventSource = new EventSource(`/api/sse/chatroom/${roomId}`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('message', (event) => {
      try {
        const newMsg = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMsg]);
      } catch (error) {
        console.error('메시지 파싱 실패:', error);
      }
    });

    eventSource.addEventListener('connect', (event) => {
      console.log('SSE 연결됨:', event.data);
    });

    eventSource.onerror = (error) => {
      console.error('SSE 에러:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  // 초기 메시지 로드
  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  // 새 메시지 올 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatRoomId: roomId,
          content: newMessage,
        }),
      });

      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm('이 메시지를 삭제하시겠습니까?')) return;

    try {
      await fetch(`/api/v1/messages/${messageId}`, {
        method: 'DELETE',
      });
      setMessages((prev) => prev.filter((m) => m.messageId !== messageId));
    } catch (error) {
      console.error('메시지 삭제 실패:', error);
      alert('메시지 삭제에 실패했습니다.');
    }
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
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">채팅방 #{roomId}</h1>
              <p className="text-xs text-gray-500">실시간 대화</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isMyMessage = message.senderUserId === currentUserId;

            return (
              <div
                key={message.messageId}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-lg ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                  {/* 프로필 */}
                  {!isMyMessage && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E0F5F1' }}
                    >
                      <span className="text-xs font-semibold" style={{ color: '#1ABC9C' }}>
                        {message.senderName[0]}
                      </span>
                    </div>
                  )}

                  <div className={isMyMessage ? 'text-right' : ''}>
                    {/* 이름 */}
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
                void sendMessage(); // Promise 경고 해결
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            disabled={sending}
          />
          <button
            onClick={() => void sendMessage()}
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
