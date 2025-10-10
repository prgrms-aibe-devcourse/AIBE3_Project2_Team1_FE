import { useState, useEffect, useCallback } from 'react';

export interface Message {
  messageId: number;
  senderUserId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

interface UseChatRoomReturn {
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useChatRoom(roomId: number): UseChatRoomReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // 메시지 목록 로드
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/messages/chatroom/${roomId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // SSE 연결
  useEffect(() => {
    const eventSource = new EventSource(`/api/v1/sse/chatroom/${roomId}`);

    eventSource.addEventListener('message', (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMessage]);
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
    fetchMessages();
  }, [fetchMessages]);

  // 메시지 전송
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        throw new Error('메시지 내용이 비어있습니다');
      }

      try {
        const response = await fetch('/api/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatRoomId: roomId,
            content: content.trim(),
          }),
        });

        if (!response.ok) throw new Error('메시지 전송 실패');
      } catch (error) {
        console.error('메시지 전송 실패:', error);
        throw error;
      }
    },
    [roomId]
  );

  // 메시지 삭제
  const deleteMessage = useCallback(async (messageId: number) => {
    try {
      const response = await fetch(`/api/v1/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('메시지 삭제 실패');

      setMessages((prev) => prev.filter((m) => m.messageId !== messageId));
    } catch (error) {
      console.error('메시지 삭제 실패:', error);
      throw error;
    }
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    deleteMessage,
    refreshMessages: fetchMessages,
  };
}
