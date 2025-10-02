import { useState, useEffect } from 'react';
import { Bell, X, FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface MatchingRequest {
  id: string;
  senderName: string;
  senderAvatar: string | null;
  senderType: 'client' | 'freelancer';
  amount: number;
  message: string;
  portfolio?: string;
  createdAt: Date;
  isRead: boolean;
}

type TabType = 'client' | 'freelancer';

interface ApiNotification {
  id: string;
  senderName: string;
  senderAvatar: string | null;
  senderType: 'client' | 'freelancer';
  amount: number;
  message: string;
  portfolio?: string;
  createdAt: string;
  isRead: boolean;
}

function ReportModal({
  isOpen,
  onClose,
  requestId,
  senderName,
}: {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  senderName: string;
}) {
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reportReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          reason: reportReason,
          detail: reportDetail,
        }),
      });
      alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
      onClose();
    } catch (error) {
      console.error('신고 실패:', error);
      alert('신고 접수에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">신고하기</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold">{senderName}</span>님의 매칭 요청을 신고합니다.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">신고 사유</label>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">선택해주세요</option>
            <option value="spam">스팸 / 도배</option>
            <option value="fraud">사기 / 허위 정보</option>
            <option value="inappropriate">부적절한 내용</option>
            <option value="harassment">욕설 / 협박</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용 (선택)</label>
          <textarea
            value={reportDetail}
            onChange={(e) => setReportDetail(e.target.value)}
            placeholder="신고 사유에 대한 상세 내용을 입력해주세요."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-24"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:bg-gray-300"
          >
            {isSubmitting ? '처리 중...' : '신고하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('client');
  const [clientRequests, setClientRequests] = useState<MatchingRequest[]>([]);
  const [freelancerRequests, setFreelancerRequests] = useState<MatchingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MatchingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications');
        const data: ApiNotification[] = await response.json();

        const processedData: MatchingRequest[] = data.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));

        const clients = processedData.filter((n) => n.senderType === 'client');
        const freelancers = processedData.filter((n) => n.senderType === 'freelancer');

        setClientRequests(clients);
        setFreelancerRequests(freelancers);
      } catch (error) {
        console.error('알림 로드 실패:', error);
        setClientRequests([]);
        setFreelancerRequests([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotifications();
  }, []);

  const currentRequests = activeTab === 'client' ? clientRequests : freelancerRequests;
  const setCurrentRequests = activeTab === 'client' ? setClientRequests : setFreelancerRequests;

  const unreadCount = currentRequests.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });

      setCurrentRequests((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const handleOpenRequest = (request: MatchingRequest) => {
    setSelectedRequest(request);
    void markAsRead(request.id);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedRequest(null);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#1ABC9C' }}
          ></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 알림 목록 */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">매칭 모음함</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('client')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                activeTab === 'client'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeTab === 'client' ? { backgroundColor: '#1ABC9C' } : {}}
            >
              클라이언트
            </button>
            <button
              onClick={() => handleTabChange('freelancer')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                activeTab === 'freelancer'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeTab === 'freelancer' ? { backgroundColor: '#1ABC9C' } : {}}
            >
              프리랜서
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => handleOpenRequest(request)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                !request.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E0F5F1' }}
                >
                  <span className="font-semibold text-lg" style={{ color: '#1ABC9C' }}>
                    {request.senderName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-semibold text-gray-900">{request.senderName}</span>
                    <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
                  </div>
                  <div className="text-sm font-medium mb-1" style={{ color: '#1ABC9C' }}>
                    {formatAmount(request.amount)}원 제안
                  </div>
                  <p className="text-sm text-gray-600 truncate">{request.message}</p>
                  {!request.isRead && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                        새 요청
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell className="w-16 h-16 mb-3" />
              <p className="text-sm">매칭 요청이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측 상세 내용 */}
      <div className="flex-1 flex flex-col">
        {selectedRequest ? (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#E0F5F1' }}
                  >
                    <span className="font-semibold" style={{ color: '#1ABC9C' }}>
                      {selectedRequest.senderName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedRequest.senderName}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedRequest.senderType === 'client' ? '클라이언트' : '프리랜서'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5" style={{ color: '#1ABC9C' }} />
                    <h4 className="font-semibold text-gray-900">제안 금액</h4>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#1ABC9C' }}>
                    {formatAmount(selectedRequest.amount)}원
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">
                      {selectedRequest.senderType === 'client'
                        ? '클라이언트 메시지'
                        : '프리랜서 메시지'}
                    </h4>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedRequest.message}
                  </p>
                </div>

                {selectedRequest.portfolio && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">첨부 파일</h4>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{selectedRequest.portfolio}</span>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">요청 시간</h4>
                  </div>
                  <p className="text-gray-600">
                    {selectedRequest.createdAt.toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#E0F5F1', borderColor: '#1ABC9C' }}
                >
                  <p className="text-sm" style={{ color: '#0D9176' }}>
                    💡 이 매칭 요청은{' '}
                    {selectedRequest.senderType === 'client' ? '클라이언트' : '프리랜서'}가 보낸
                    일방향 메시지입니다. 관심이 있으시다면 직접 연락하시기 바랍니다.
                  </p>
                </div>

                {/* 신고 버튼 */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">이 요청 신고하기</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Bell className="w-20 h-20 mx-auto mb-4" />
              <p className="text-lg">매칭 요청을 선택해주세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 신고 모달 */}
      {selectedRequest && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          requestId={selectedRequest.id}
          senderName={selectedRequest.senderName}
        />
      )}
    </div>
  );
}
