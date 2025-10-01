interface EmptyStateProps {
  message: string;
  buttonLabel?: string;
  onClick?: () => void;
}

const EmptyState = ({ message, buttonLabel, onClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-8">
      <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full mt-10" />
      <p className="mb-4">{message}</p>
      {buttonLabel && (
        <button
          onClick={onClick}
          className="px-6 py-2 rounded-full bg-red-400 text-white hover:bg-red-500"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
