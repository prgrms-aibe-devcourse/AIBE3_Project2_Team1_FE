import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../features/project/api';
import { categoryGroups } from '../features/project/constants/categories';
import type { CategoryId } from '../features/project/constants/categories';
import { AxiosError } from 'axios';

export default function WritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // AiRecommendPage에서 전달된 추천 프로젝트
  const chosenProject = location.state?.chosenProject as
    | { title: string; description: string; budget: number; deadline: string; category: string }
    | undefined;

  const role: 'client' | 'freelancer' = 'freelancer';

  const [category, setCategory] = useState<CategoryId | ''>(
    (chosenProject?.category as CategoryId) || ''
  );
  const [content, setContent] = useState(chosenProject?.description || '');
  const [title, setTitle] = useState(chosenProject?.title || '');
  const [budget, setBudget] = useState(chosenProject?.budget?.toString() || '');
  const [deadline, setDeadline] = useState(chosenProject?.deadline || '');
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const currentGroup = categoryGroups.find((g) => g.groupId === role);
  const categories = currentGroup ? currentGroup.categories : [];

  /** 이미지 파일 선택 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  /** 이미지 업로드 */
  const handleImageUpload = async () => {
    if (images.length === 0) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    try {
      setUploading(true);
      const res = await api.post('/files/images', formData); // ← FormData로 전송 (headers 자동 설정)
      const urls = res.data?.data || res.data;
      setUploadedImageUrls(urls);
      alert('이미지 업로드 완료!');
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  /** 업로드된 이미지 삭제 */
  const handleImageDelete = async (url: string) => {
    try {
      await api.delete('/files/images', {
        params: { url }, // ✅ 서버 요구사항: query param 으로 전달
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 금지
        },
      });

      setUploadedImageUrls((prev) => prev.filter((u) => u !== url));
      alert('이미지가 삭제되었습니다.');
    } catch (err) {
      console.error('❌ 이미지 삭제 실패:', err);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  /** 프로젝트 등록 */
  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!title || !content || !category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const parsedBudget = Number(budget);

    // dto 객체를 JSON 문자열로 변환
    const dto = JSON.stringify({
      title,
      description: content,
      budget: parsedBudget,
      deadline, // yyyy-MM-dd 형식 그대로
      category,
    });

    const formData = new FormData();
    formData.append('dto', new Blob([dto], { type: 'application/json' }));

    // 이미지가 있다면 추가
    images.forEach((img) => formData.append('images', img));

    try {
      const res = await api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const createdProjectId = res.data?.data?.projectId;

      console.log('✅ 등록 성공:', res.data);
      alert('등록 완료!');
      navigate(`/project/${createdProjectId}`);
    } catch (err: unknown) {
      console.error('❌ 등록 실패:', err);

      let message = '서버 오류';

      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        message = axiosErr.response?.data?.message || message;
      }

      alert(`프로젝트 등록 중 오류가 발생했습니다: ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-[1000px] bg-white rounded-[20px] shadow-md p-8">
        {/* 제목 */}
        <input
          type="text"
          placeholder="프로젝트 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        {/* 예산 */}
        <input
          type="number"
          placeholder="예산"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          step={10000} // 10000원 단위로 증감
          min={0}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        {/* 마감일 */}
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        {/* 카테고리 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="w-[150px] h-[40px] px-4 border border-gray-300 rounded-[13px] text-[15px] font-medium text-gray-700 bg-white appearance-none mb-3"
        >
          <option value="">카테고리 선택</option>
          {categories
            .filter((c) => c.id !== 'ALL')
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        {/* 내용 */}
        <textarea
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 border border-gray-200 rounded-xl bg-gray-100 p-4 text-sm mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">프로젝트 이미지 업로드</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-[10px] cursor-pointer focus:outline-none"
          />

          <button
            onClick={handleImageUpload}
            disabled={uploading}
            className={`mt-3 px-4 py-2 rounded-[10px] text-white ${
              uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploading ? '업로드 중...' : '이미지 업로드'}
          </button>

          {/* 업로드된 이미지 목록 */}
          {uploadedImageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {uploadedImageUrls.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt="uploaded"
                    className="w-full h-24 object-cover rounded-[10px] border"
                  />
                  <button
                    onClick={() => handleImageDelete(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-[15px] font-semibold text-[18px]"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
