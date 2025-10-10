import { useState } from 'react';

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

const projects = [
  { id: 1, title: '전국 출장 음식사진 전문', image: '/sample1.jpg' },
  { id: 2, title: '전국 출장 음식사진 전문', image: '/sample2.jpg' },
  { id: 3, title: '전국 출장 음식사진 전문', image: '/sample3.jpg' },
];

export default function AiRecommendPage() {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <header className="bg-white shadow-sm px-8 py-4 relative w-full">
        <div className="text-center relative">
          <div className="text-rose-500 font-bold text-4xl inline-block">Pickple</div>
        </div>

        <div className="mt-6 text-left pl-4">
          <h1 className="text-2xl font-semibold text-gray-800">AI 추천</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-6 py-10 bg-gray-100 space-y-10">
        <section>
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

        <section>
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

        <section>
          <h2
            className="text-base font-medium text-white px-4 py-2 inline-block rounded-[20px] mb-6"
            style={{ background: '#FF6B6B' }}
          >
            당신에게 추천하는 프로젝트는...
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-end">
            {projects.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '240px',
                    height: '167px',
                    flexShrink: 0,
                    borderRadius: '20px',
                    background: '#D9D9D9',
                    overflow: 'hidden',
                  }}
                >
                  <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                </div>
                <div
                  className="mt-4"
                  style={{
                    color: '#2C2C2C',
                    textAlign: 'center',
                    fontFamily: '"Pretendard Variable", sans-serif',
                    fontSize: '32px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: 'normal',
                  }}
                >
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
