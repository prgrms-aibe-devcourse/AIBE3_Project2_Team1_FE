import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="bg-gray-800 text-white text-sm py-1 px-4">로그인 페이지</div>
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-rose-400">
          Pickple
        </Link>
        <nav className="flex space-x-6 text-sm text-gray-700 font-medium">
          <Link to="/freelancers" className="hover:text-rose-400">
            프리랜서 찾기
          </Link>
          <Link to="/projects" className="hover:text-rose-400">
            프로젝트 찾기
          </Link>
          <Link to="/login" className="hover:text-rose-400">
            로그인
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/signup" className="hover:text-rose-400">
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
