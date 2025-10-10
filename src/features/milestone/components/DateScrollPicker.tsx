import { useEffect, useMemo, useRef, useCallback } from 'react';

interface DateScrollPickerProps {
  value: Date; // ✅ 컨트롤드 값
  onDateChange: (date: Date) => void;
}

/**
 * - 네이티브 스크롤 + scroll-snap 사용
 * - 아이템 실제 높이 측정 → 스크롤 위치 ↔ 값 동기화 안정화
 * - 부모가 넘긴 value만 진실 값(내부 상태 없음)
 */
export default function DateScrollPicker({ value, onDateChange }: DateScrollPickerProps) {
  const year = value.getFullYear();
  const month = value.getMonth() + 1; // 1~12
  const day = value.getDate();
  const currentYear = new Date().getFullYear();
  const minYear = Math.min(currentYear, year) - 3;

  const years = useMemo(() => Array.from({ length: 10 }, (_, i) => minYear + i), [minYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1),
    [year, month]
  );

  // 값 변경 헬퍼들
  const setYear = (y: number) => {
    const maxDay = getDaysInMonth(y, month);
    const d = Math.min(day, maxDay);
    onDateChange(new Date(y, month - 1, d));
  };
  const setMonth = (m: number) => {
    const maxDay = getDaysInMonth(year, m);
    const d = Math.min(day, maxDay);
    onDateChange(new Date(year, m - 1, d));
  };
  const setDay = (d: number) => onDateChange(new Date(year, month - 1, d));

  return (
    <div className="flex gap-2">
      <ScrollColumn list={years} value={year} onChange={setYear} label="년" />
      <ScrollColumn list={months} value={month} onChange={setMonth} label="월" />
      <ScrollColumn list={days} value={day} onChange={setDay} label="일" />
    </div>
  );
}

function ScrollColumn({
  list,
  value,
  onChange,
  label,
}: {
  list: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const itemHeightRef = useRef<number>(36); // fallback

  // 아이템 실제 높이 측정 (첫 렌더)
  useEffect(() => {
    if (firstItemRef.current) {
      const h = firstItemRef.current.getBoundingClientRect().height;
      if (h > 0) itemHeightRef.current = h;
    }
  }, []);

  // 값 → 스크롤 위치
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.max(0, list.indexOf(value));
    el.scrollTo({ top: idx * itemHeightRef.current, behavior: 'smooth' });
  }, [value, list]);

  // 스크롤 → 값 동기화
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const raw = el.scrollTop / itemHeightRef.current;
    const idx = Math.round(raw);
    const clamped = Math.min(Math.max(idx, 0), list.length - 1);
    const next = list[clamped];
    if (next !== value) onChange(next);
  }, [value, onChange, list]);

  return (
    <div className="flex-1">
      <div className="text-center text-xs text-gray-500 mb-1">{label}</div>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="h-40 overflow-y-auto border border-gray-200 rounded-md snap-y snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {list.map((item, i) => (
          <button
            key={item}
            ref={i === 0 ? firstItemRef : null}
            onClick={() => onChange(item)}
            className={`w-full h-9 leading-9 text-sm snap-start hover:bg-gray-50 transition-colors ${
              item === value ? 'bg-teal-50 font-semibold text-teal-600' : ''
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
