import React, { useState } from 'react';

const PortfolioUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <label className="block font-medium mb-2">첨부할 포트폴리오</label>

      <div className="flex items-center space-x-4">
        {/* 파일 입력 (숨김) */}
        <input type="file" id="portfolio" onChange={handleFileChange} className="hidden" />
        {/* 커스텀 버튼 */}
        <label
          htmlFor="portfolio"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-400 transition-colors"
        >
          파일 추가
        </label>

        {/* 파일명 출력 */}
        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
      </div>
    </div>
  );
};

export default PortfolioUpload;
