interface FreelancerCardProps {
  image: string;
  name: string;
  info: string;
  onClick?: () => void;
}

const FreelancerCard = ({ image, name, info, onClick }: FreelancerCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{info}</p>
    </button>
  );
};

export default FreelancerCard;
