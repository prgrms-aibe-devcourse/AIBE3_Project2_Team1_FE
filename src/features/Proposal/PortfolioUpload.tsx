import React, { useState } from 'react';

interface PortfolioUploadProps {
  onFilesSelect: (files: File[]) => void;
}
const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ onFilesSelect }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [allFiles, setAllFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // 부모로 전체 파일 목록 전달
      const updatedFiles = [...allFiles, ...newFiles];
      setAllFiles(updatedFiles);
      onFilesSelect(updatedFiles);

      // 파일 이름도 누적
      setFileNames((prev) => [...prev, ...newFiles.map((file) => file.name)]);

      // 같은 파일 다시 선택 가능하도록 초기화
      e.target.value = '';
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
        {fileNames.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-600">
            {fileNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PortfolioUpload;
