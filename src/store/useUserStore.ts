import { create } from 'zustand';

// Zustand 활용하여 유저 상태를 관리하기 위한 파일 (전역 사용)

// User 객체 타입 정의
export interface User {
  userId: number; // 유저 ID
  email: string; // 이메일
  nickname: string; // 닉네임
  role: 'CLIENT' | 'FREELANCER'; // 유저 역할 (클라이언트 or 프리랜서)
}

// Zustand 구조 정의
interface UserStore {
  user: User | null; // 현재 로그인된 유저 정보 (없으면 null)
  isLoggedIn: boolean; // 로그인 여부 상태

  // 유저 정보를 저장
  setUser: (user: User) => void;

  // 로그아웃 함수
  logout: () => void;

  // 앱 실행 시 localStorage에서 유저 정보 불러오기
  loadUserFromStorage: () => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserStore>((set) => ({
  user: null, // 초기 유저 상태는 null
  isLoggedIn: false, // 초기 로그인 상태는 false

  // 로그인 후 유저 정보 저장 및 상태 변경
  setUser: (user) => {
    // 브라우저 localStorage에 유저 정보를 문자열로 저장
    localStorage.setItem('user', JSON.stringify(user));

    // Zustand 상태 업데이트
    set({ user, isLoggedIn: true });
  },

  // 로그아웃 -> 상태 초기화 및 로컬 스토리지 정리
  logout: () => {
    localStorage.removeItem('user'); // 유저 정보 제거
    localStorage.removeItem('accessToken'); // 토큰도 함께 제거
    set({ user: null, isLoggedIn: false }); // Zustand 상태 초기화
  },

  // 페이지 새로고침 시, localStorage에서 유저 정보 복구
  loadUserFromStorage: () => {
    const userStr = localStorage.getItem('user'); // 저장된 유저 정보 가져오기
    if (userStr) {
      const parsed = JSON.parse(userStr); // 문자열 → 객체로 변환
      set({ user: parsed, isLoggedIn: true }); // Zustand 상태 업데이트
    }
  },
}));
