import { AuthContext } from '@/features/auth/AuthContext';
import { logout } from '@/features/auth/auth';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout(); // 서버에 로그아웃 요청

      // 로컬스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('apiKey');
      localStorage.removeItem('user');

      // 상태 초기화
      setUser(null);

      console.log('로그아웃 완료');
    } catch (err) {
      console.error('로그아웃 실패', err);
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-rose-400">
          Pickple
        </Link>

        <nav className="flex items-center space-x-8 text-sm text-gray-700 font-medium">
          <Link to="/projects/freelancer" className="hover:text-rose-400">
            프리랜서 찾기
          </Link>
          <Link to="/projects/client" className="hover:text-rose-400">
            프로젝트 찾기
          </Link>

          <div className="flex items-center space-x-2">
            {user?.nickname ? (
              <>
                <span className="font-medium">{user.nickname}님</span>
                <span className="text-gray-300">|</span>
                <button onClick={handleLogout} className="hover:text-rose-400">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-rose-400">
                  로그인
                </Link>
                <span className="text-gray-300">|</span>
                <Link to="/signup" className="hover:text-rose-400">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
