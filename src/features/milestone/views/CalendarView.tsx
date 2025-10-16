import { useState, useEffect, useCallback, useRef } from 'react';
import DateScrollPicker from '../components/DateScrollPicker';
import { calendarApi, type CalendarEventResponse } from '../api/milestoneApi';

interface EventItem {
  id: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const fmt = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

export default function CalendarView({
  milestoneId = 1,
  refreshTick,
  onChanged,
}: {
  milestoneId?: number;
  refreshTick?: number;
  onChanged?: () => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const etagRef = useRef<string | undefined>(undefined);

  // 일정 추가 모달
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [pickerDate, setPickerDate] = useState<Date | null>(null);

  // 일정 편집 모달
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPickerDate, setEditPickerDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const hasEvent = (date: Date) => events.some((e) => e.date === fmt(date));
  const getEventsForDate = (date: Date) => events.filter((e) => e.date === fmt(date));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    openAddModalFor(date);
  };

  const openAddModalFor = (date: Date) => {
    setPickerDate(date);
    setNewEventTitle('');
    setShowAddModal(true);
  };

  const fetchEvents = useCallback(async () => {
    try {
      const res = await calendarApi.listConditional(milestoneId!, etagRef.current);
      if (res.status === 200 && Array.isArray(res.data)) {
        const list = res.data as CalendarEventResponse[];
        setEvents(
          list.map((e) => ({
            id: String(e.eventId ?? e.id),
            title: e.title,
            date: e.date,
          }))
        );
        etagRef.current = res.etag ?? etagRef.current;
      }
    } catch (e) {
      console.error('일정 목록 로드 실패', e);
    }
  }, [milestoneId]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]); // 최초 1회
  useEffect(() => {
    if (refreshTick === undefined) return; // 변할 때마다 갱신
    void fetchEvents();
  }, [refreshTick, fetchEvents]); // 준실시간

  const openAddModal = () => {
    if (!selectedDate) return;
    setPickerDate(selectedDate);
    setNewEventTitle('');
    setShowAddModal(true);
  };

  const addEvent = async () => {
    if (!newEventTitle.trim() || !pickerDate) return;
    try {
      const created = await calendarApi.create(milestoneId, newEventTitle.trim(), fmt(pickerDate));
      setEvents((prev) => [
        { id: String(created.eventId ?? created.id), title: created.title, date: created.date },
        ...prev,
      ]);
      setSelectedDate(pickerDate);
      setNewEventTitle('');
      setShowAddModal(false);
      onChanged?.();
    } catch (e) {
      console.error('일정 추가 실패', e);
    }
  };

  // 편집 플로우
  const openEditModal = (ev: EventItem) => {
    setEditingEvent(ev);
    setEditTitle(ev.title);
    const [y, m, d] = ev.date.split('-').map((n) => parseInt(n, 10));
    setEditPickerDate(new Date(y, m - 1, d));
    setShowEditModal(true);
  };

  const saveEditedEvent = async () => {
    if (!editingEvent || !editPickerDate || !editTitle.trim()) return;
    try {
      const updated = await calendarApi.update(milestoneId, Number(editingEvent.id), {
        title: editTitle.trim(),
        date: fmt(editPickerDate),
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                id: String(updated.eventId ?? updated.id),
                title: updated.title,
                date: updated.date,
              }
            : e
        )
      );
      setSelectedDate(editPickerDate);
      setShowEditModal(false);
      setEditingEvent(null);
      onChanged?.();
    } catch (e) {
      console.error('일정 편집 실패', e);
    }
  };

  // ✅ 일정 삭제
  const removeEvent = async (id: string) => {
    try {
      await calendarApi.remove(milestoneId, Number(id));
      setEvents((prev) => prev.filter((e) => e.id !== id));
      onChanged?.();
    } catch (e) {
      console.error('일정 삭제 실패', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
        {/* 왼쪽: 작은 캘린더 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
              ◀
            </button>
            <h3 className="text-sm font-bold text-gray-900">
              {year}년 {month + 1}월
            </h3>

            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-[10px] text-gray-500 py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate != null && isSameDay(date, selectedDate);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(date)}
                  className={[
                    'aspect-square rounded-md flex items-center justify-center text-xs transition-colors relative',
                    'hover:bg-gray-100',
                    isToday ? 'outline outline-1 outline-[#FF6B6B]' : '',
                    isSelected ? 'bg-pink-500 text-white font-bold' : 'text-gray-700',
                  ].join(' ')}
                >
                  {day}
                  {hasEvent(date) && !isSelected && (
                    <div className="absolute bottom-0.5 w-1 h-1 bg-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 오른쪽: 일정 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedDate
                ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
                : '날짜를 선택하세요'}
            </h2>
            {selectedDate && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                일정 추가
              </button>
            )}
          </div>

          <div className="space-y-3 min-h-[300px]">
            {selectedDate ? (
              getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-900 font-medium">{event.title}</p>
                      <button
                        onClick={() => openEditModal(event)}
                        className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-100"
                      >
                        편집
                      </button>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">일정이 없습니다</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400">날짜를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 일정 추가 모달 */}
      {showAddModal && pickerDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">일정 추가</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEventTitle('');
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="일정 제목 입력"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 선택</label>
                <DateScrollPicker value={pickerDate} onDateChange={setPickerDate} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEventTitle('');
                  }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={addEvent}
                  disabled={!newEventTitle.trim()}
                  className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 일정 편집 모달 */}
      {showEditModal && editingEvent && editPickerDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">일정 편집</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="일정 제목 입력"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 선택</label>
                <DateScrollPicker value={editPickerDate} onDateChange={setEditPickerDate} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={saveEditedEvent}
                  disabled={!editTitle.trim()}
                  className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
