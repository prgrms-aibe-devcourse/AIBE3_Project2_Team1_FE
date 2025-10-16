import { useState, useEffect } from 'react';
import { axiosInstance } from '@/services/axios';
import { useNavigate } from 'react-router-dom';

const budgets = [
  { label: '1~10만원', value: '1-10' },
  { label: '10~20만원', value: '10-20' },
  { label: '20~50만원', value: '20-50' },
  { label: '50만원 이상', value: '50+' },
];

const durations = [
  { label: '7일 이내', value: '7' },
  { label: '7일~31일', value: '7-31' },
  { label: '2~3개월', value: '60-90' },
  { label: '6개월 이상', value: '180+' },
];

interface MatchingResponse {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
}

export default function AiRecommendPage() {
  const [projectTopic, setProjectTopic] = useState('');
  const [confirmedTopic, setConfirmedTopic] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [recommendations, setRecommendations] = useState<MatchingResponse[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && projectTopic.trim()) {
      e.preventDefault();
      setConfirmedTopic(projectTopic.trim());
    }
  };

  // ✅ 3개 값이 모두 선택되면 추천 API 호출
  useEffect(() => {
    const sendMatchingRequest = async () => {
      try {
        const requestBody = {
          subject: confirmedTopic,
          budget: selectedBudget,
          duration: selectedDuration,
        };

        console.log('📤 MatchingRequest payload:', requestBody);

        const response = await axiosInstance.post('/matching/ai', requestBody);
        console.log('✅ 서버 응답:', response.data);

        setRecommendations(response.data); // 서버에서 MatchingResponse[] 반환
        setIsSubmitted(true);
      } catch (err) {
        console.error('❌ 매칭 요청 실패:', err);
      }
    };

    if (confirmedTopic && selectedBudget && selectedDuration) {
      sendMatchingRequest();
    }
  }, [confirmedTopic, selectedBudget, selectedDuration]);

  const handleSelect = (index: number) => {
    setSelectedRecommendation(index);
  };

  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selectedRecommendation === null) {
      alert('추천 중 하나를 선택해주세요.');
      return;
    }
    const chosen = recommendations[selectedRecommendation];
    alert(`"${chosen.title}" 프로젝트를 선택하셨습니다!`);
    console.log('✅ 선택된 추천:', chosen);

    // 선택 결과를 프로젝트 생성페이지로 전달
    navigate('/project/write', { state: { chosenProject: chosen } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <main className="flex-1 w-full max-w-5xl px-6 py-10 bg-gray-100 space-y-10">
        {/* 0️⃣ 프로젝트 주제 입력 */}
        <section className="fade-in">
          <h2
            className="text-base font-medium text-white px-4 py-2 inline-block rounded-[20px] mb-6"
            style={{ background: '#FF6B6B' }}
          >
            어떤 프로젝트를 찾고 계신가요?
          </h2>

          <div className="flex justify-end">
            <input
              type="text"
              value={projectTopic}
              onChange={(e) => setProjectTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 반려동물 사진 촬영, 로고 디자인 등 (입력 후 Enter)"
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-full text-gray-800 
                         focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </div>
          {confirmedTopic && (
            <p className="text-right text-gray-600 mt-2">
              ✔️ 입력하신 주제: <span className="font-semibold">{confirmedTopic}</span>
            </p>
          )}
        </section>

        {/* 1️⃣ 금액 선택 */}
        {confirmedTopic && (
          <section className="fade-in">
            <h2
              className="text-base font-medium text-white px-4 py-2 inline-block rounded-[20px] mb-6"
              style={{ background: '#FF6B6B' }}
            >
              금액은 어느 정도를 예상하시나요?
            </h2>

            <div className="flex flex-wrap justify-end gap-3">
              {budgets.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setSelectedBudget(b.value)}
                  className={`px-5 py-2.5 rounded-full border transition 
                    ${
                      selectedBudget === b.value
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 2️⃣ 기간 선택 */}
        {selectedBudget && (
          <section className="fade-in">
            <h2
              className="text-base font-medium text-white px-4 py-2 inline-block rounded-[20px] mb-6"
              style={{ background: '#FF6B6B' }}
            >
              며칠 정도의 프로젝트를 원하시나요?
            </h2>

            <div className="flex flex-wrap justify-end gap-3">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDuration(d.value)}
                  className={`px-5 py-2.5 rounded-full border transition 
                    ${
                      selectedDuration === d.value
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3️⃣ 추천 결과 표시 */}
        {isSubmitted && recommendations.length > 0 && (
          <section className="fade-in">
            <h2
              className="text-base font-medium text-white px-4 py-2 inline-block rounded-[20px] mb-6"
              style={{ background: '#FF6B6B' }}
            >
              당신에게 추천하는 프로젝트는...
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`p-6 rounded-2xl border cursor-pointer transition
                    ${
                      selectedRecommendation === i
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-300 bg-white hover:shadow-sm'
                    }`}
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>예산:</strong> {rec.budget.toLocaleString()}만원
                    </li>
                    <li>
                      <strong>마감일:</strong> {rec.deadline}
                    </li>
                    <li>
                      <strong>카테고리:</strong> {rec.category}
                    </li>
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedRecommendation === null}
              className={`mt-8 px-6 py-3 rounded-full text-white font-medium transition
                ${
                  selectedRecommendation === null
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
            >
              선택 완료
            </button>
          </section>
        )}
      </main>

      <style>
        {`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}
