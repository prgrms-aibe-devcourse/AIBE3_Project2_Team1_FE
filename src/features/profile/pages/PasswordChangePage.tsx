import React from 'react';

const PasswordChangePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex gap-16">
        {/* 오른쪽 입력 폼 */}
        <form className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">현재 비밀번호</label>
            <input
              type="text"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">새 비밀번호</label>
            <input
              type="text"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">새 비밀번호 확인</label>
            <input
              type="text"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          {/* 수정 버튼 */}
          <button
            type="submit"
            className="mt-6 bg-rose-400 text-white py-2 rounded-md hover:bg-rose-500 transition"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePage;
