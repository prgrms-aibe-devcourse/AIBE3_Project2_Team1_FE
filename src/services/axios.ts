import axios from 'axios';
/**
 *  - 백엔드 API 요청을 위한 axios 인스턴스 관련 설정 파일
 *  - 모든 API 요청에 공통된 설정을 적용합니다.
 *  - 토큰 자동 주입 및 응답 에러를 통합 처리하기 위한 공통 파일
 */

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1', // API의 기본 URL (환경 변수에서 가져오거나 기본값 사용)
  withCredentials: true, // 쿠키 등 인증 정보 포함
  headers: {
    'Content-Type': 'application/json', // 기본 요청 헤더
  },
});

export default axiosInstance;

// 요청 인터셉터 설정 -> 로컬 스토리지에서 accessToken을 가져와 Authorization 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // 헤더에 Bearer 토큰 형태로 Authorization 추가
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 -> 에러 응답이 발생했을 때 공통 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 응답은 그대로 반환
  (error) => {
    // 인증 실패 (토큰 만료, 로그아웃 필요 등)
    if (error.response?.status === 401) {
      console.error('인증 오류 발생', error.response);
      // TODO: 로그아웃 처리, 토큰 재발급 요청, 로그인 페이지 이동 등의 설정 필요
    }

    return Promise.reject(error);
  }
);
