import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function MatchDetailPage() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('열심히 하겠습니다!');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-center px-8 py-4 shadow-sm">
        <h1 className="text-rose-500 font-bold text-4xl">Pickple</h1>
      </header>

      {/* 본문 */}
      <main className="flex-1 flex flex-col items-center px-8 py-10">
        {/* 파일 업로드 */}
        <div className="flex items-center justify-between w-full max-w-2xl border border-gray-300 rounded-full px-6 py-3 mb-6">
          <div className="text-gray-700 font-medium">
            명세서 {file ? `(${file.name})` : '(파일 이름)'}
          </div>
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <div className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
              <Upload className="w-5 h-5 text-gray-700" />
            </div>
          </label>
        </div>

        {/* 설명 박스 */}
        <div className="w-full max-w-2xl bg-gray-100 rounded-2xl p-6 text-gray-700 mb-8">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent outline-none resize-none text-lg"
            rows={4}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="w-full max-w-2xl flex justify-end gap-4">
          <button className="bg-gray-300 hover:bg-teal-500 text-gray-800 hover:text-white px-6 py-2 rounded-lg font-medium">
            매칭 수락
          </button>
          <button className="bg-gray-300 hover:bg-teal-500 text-gray-800 hover:text-white px-6 py-2 rounded-lg font-medium">
            매칭 거절
          </button>
        </div>
      </main>
    </div>
  );
}
