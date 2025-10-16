import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { axiosInstance } from '@/services/axios';

export interface Message {
  messageId: number;
  senderUserId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

interface ServerMessage {
  messageId: number;
  senderUserId: number;
  senderName: string;
  content: string;
  createDate?: string;
  createdAt?: string;
}

interface UseChatRoomReturn {
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export function useChatRoom(roomId: number): UseChatRoomReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // 메시지 목록 로드
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      //  axiosInstance는 기본적으로 baseURL과 Authorization 헤더를 포함
      const res = await axiosInstance.get(`/messages/${roomId}`);

      //  CommonResponse 구조 대응
      const rawList: ServerMessage[] = res.data?.data ?? res.data ?? [];

      const mapped: Message[] = rawList.map((m: ServerMessage) => ({
        messageId: m.messageId,
        senderUserId: m.senderUserId,
        senderName: m.senderName,
        content: m.content,
        createdAt: m.createDate ?? m.createdAt ?? '',
      }));

      setMessages(mapped);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('메시지 로드 실패 (AxiosError):', error.response?.data || error.message);

        if (error.response?.status === 401) {
          alert('인증이 필요합니다.');
        } else {
          alert('메시지 로드 중 오류가 발생했습니다.');
        }
      } else {
        console.error('메시지 로드 실패 (UnknownError):', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // SSE 연결
  useEffect(() => {
    const baseURL = axiosInstance.defaults.baseURL || '';
    const token = localStorage.getItem('accessToken');
    const url = token
      ? `${baseURL}/sse/connect?chatRoomId=${roomId}&token=${encodeURIComponent(token)}`
      : `${baseURL}/sse/connect?chatRoomId=${roomId}`;

    const es = new EventSource(url);

    es.addEventListener('message', (event) => {
      try {
        const m = JSON.parse(event.data);

        // SSE로 온 페이로드도 필드 매핑 통일
        const newMsg: Message = {
          messageId: m.messageId,
          senderUserId: m.senderUserId,
          senderName: m.senderName,
          content: m.content,
          createdAt: m.createDate ?? m.createdAt ?? new Date().toISOString(),
        };

        // 중복 체크 (핵심!)
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.messageId === newMsg.messageId);
          if (exists) {
            console.log(' Duplicate message ignored:', newMsg.messageId);
            return prev;
          }
          console.log(' New message added:', newMsg.messageId);
          return [...prev, newMsg];
        });
      } catch (error) {
        console.error('메시지 파싱 실패:', error);
      }
    });

    es.addEventListener('connect', (event) => {
      console.log('SSE 연결됨:', event.data);
    });

    es.onerror = (error) => {
      console.error('SSE 에러:', error);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [roomId]);

  // 초기 메시지 로드
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 메시지 전송 (Authorization 헤더 추가)
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) throw new Error('메시지 내용이 비어있습니다');

      const res = await fetch('/messages', {
        method: 'POST',
        headers: authHeaders(), // 수정!
        body: JSON.stringify({
          chatRoomId: roomId,
          content: content.trim(),
        }),
      });

      if (!res.ok) throw new Error('메시지 전송 실패');
    },
    [roomId]
  );
  // 메시지 삭제
  const deleteMessage = useCallback(async (messageId: number) => {
    try {
      const response = await fetch(`/messages/${messageId}`, {
        method: 'DELETE',
        headers: authHeaders(),
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
