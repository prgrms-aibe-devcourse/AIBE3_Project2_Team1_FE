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
      const updatedFiles = [...allFiles, ...newFiles];

      setAllFiles(updatedFiles);
      setFileNames((prev) => [...prev, ...newFiles.map((file) => file.name)]);
      onFilesSelect(updatedFiles);

      // 같은 파일 다시 선택 가능하도록 초기화
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = allFiles.filter((_, i) => i !== index);
    const updatedNames = fileNames.filter((_, i) => i !== index);

    setAllFiles(updatedFiles);
    setFileNames(updatedNames);
    onFilesSelect(updatedFiles);
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <label className="block font-medium mb-2">첨부할 포트폴리오</label>

      <div className="flex flex-col space-y-3">
        {/* 파일 추가 버튼 */}
        <div>
          <input
            type="file"
            id="portfolio"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <label
            htmlFor="portfolio"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-400 transition-colors"
          >
            파일 추가
          </label>
        </div>

        {/* 파일 목록 */}
        {fileNames.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {fileNames.map((name, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="truncate max-w-[200px]">{name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="text-red-500 hover:text-red-700 text-xs ml-2"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PortfolioUpload;
