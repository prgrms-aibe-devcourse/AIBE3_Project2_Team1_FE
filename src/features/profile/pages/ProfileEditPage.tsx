import React from 'react';
import ProfileImage from '../components/ProfileImage';

const ProfileEditPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex gap-16">
        <ProfileImage />

        {/* 오른쪽 입력 폼 */}
        <form className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">이름</label>
            <input
              type="text"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">닉네임</label>
            <input
              type="text"
              className="w-80 border rounded-md px-3 py-2 outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">휴대전화</label>
            <div className="flex gap-2">
              <input type="text" className="w-20 border rounded-md px-2 py-2" />
              <input type="text" className="w-20 border rounded-md px-2 py-2" />
              <input type="text" className="w-20 border rounded-md px-2 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">생년월일</label>
            <div className="flex gap-2">
              <input type="text" placeholder="년" className="w-20 border rounded-md px-2 py-2" />
              <input type="text" placeholder="월" className="w-16 border rounded-md px-2 py-2" />
              <input type="text" placeholder="일" className="w-16 border rounded-md px-2 py-2" />
            </div>
          </div>

          {/* 수정 버튼 */}
          <button
            type="submit"
            className="mt-6 bg-rose-400 text-white py-2 rounded-md hover:bg-rose-500 transition"
          >
            프로필 수정
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
