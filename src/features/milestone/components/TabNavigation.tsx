interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', label: '개요' },
  { id: 'kanban', label: '칸반 보드' },
  { id: 'calendar', label: '캘린더' },
  { id: 'files', label: '파일' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.id ? '' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ color: activeTab === tab.id ? '#FF6B6B' : undefined }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#FF6B6B' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
