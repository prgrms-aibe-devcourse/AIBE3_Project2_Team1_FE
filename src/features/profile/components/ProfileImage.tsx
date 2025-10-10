import React, { useRef, useState } from 'react';

const ProfileImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
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
