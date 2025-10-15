import StarRating from '@/components/StarRating';
import { postReview } from '@/features/review/apis/api';
import axiosInstance from '@/services/axios';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewWritePage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    const formData = new FormData();
    images.forEach((img) => formData.append('images', img));
    const res = await axiosInstance.post('files/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };

  const handleSubmit = async () => {
    if (!projectId) return alert('프로젝트 ID가 없습니다.');
    if (!rating || !content) return alert('평점과 후기를 모두 입력해주세요.');

    try {
      setIsSubmitting(true);
      const uploadedUrls = await uploadImages();

      await postReview({
        projectId: Number(projectId),
        rating,
        comment: content,
        images: uploadedUrls,
      });

      alert('리뷰 등록 완료');
      navigate(`/project/${projectId}`);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('리뷰 등록 중 오류가 발생했습니다.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">리뷰 작성</h2>

      {/* 평점 */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm font-medium">평점</span>
        <StarRating value={rating} onChange={setRating} size={28} />
        <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        <div className="flex gap-2 flex-wrap">
          {imageUrls.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`미리보기 ${idx + 1}`}
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      {/* 후기 작성 */}
      <textarea
        className="w-full h-40 bg-gray-100 p-4 rounded-lg resize-none outline-none mb-4"
        placeholder="후기를 공유해 주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 제출 버튼 */}
      <div className="text-right">
        <button
          className="bg-teal-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-teal-600 disabled:opacity-50"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
      </div>
    </div>
  );
};

export default ReviewWritePage;
