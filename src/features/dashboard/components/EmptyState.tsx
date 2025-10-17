interface EmptyStateProps {
  message: string;
  buttonLabel?: string;
  onClick?: () => void;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-8">
      <p className="mb-4">{message}</p>
    </div>
  );
};

export default EmptyState;
