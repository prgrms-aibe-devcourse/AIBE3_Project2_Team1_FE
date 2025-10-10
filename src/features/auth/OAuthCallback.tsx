// 소셜 로그인 콜백 처리 페이지
import { useAuth } from '@/features/auth/AuthContext';
import { getCurrentUser } from '@/features/auth/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OAuthCallback = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res?.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('OAuth 로그인 상태 복원 실패', err);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
        navigate('/');
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? <p>로그인 상태 확인 중...</p> : <p>로그인 완료!</p>}
    </div>
  );
};

export default OAuthCallback;
