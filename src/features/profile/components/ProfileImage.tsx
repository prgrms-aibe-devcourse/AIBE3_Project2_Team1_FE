import React, { useEffect, useRef, useState } from 'react';
import { getMyUser, type UserResponseDto } from '../profile';
import { axiosInstance } from '../../../services/axios';

interface ProfileImageUploadProps {
  initialImageUrl?: string; // 부모 컴포넌트에서 전달 가능
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ initialImageUrl }) => {
  const [image, setImage] = useState<string | null>(initialImageUrl ?? null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API에서 불러오기
  useEffect(() => {
    if (!initialImageUrl) {
      const fetchUser = async () => {
        try {
          const res: UserResponseDto = await getMyUser();
          setImage(res.data.ProfileImgUrl ?? null);
        } catch (err) {
          console.error('유저 이미지 로드 실패', err);
        }
      };
      fetchUser();
    }
  }, [initialImageUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/users/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setToastMessage('프로필 이미지가 업로드되었습니다!');
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setToastMessage('이미지 업로드에 실패했습니다 😢');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}
      <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt="프로필" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm">No Image</span>
        )}
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-600 text-sm border px-2 py-1 rounded-md"
      >
        사진 수정
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;
