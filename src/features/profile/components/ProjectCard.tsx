interface ProjectCardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

const ProjectCard = ({ image, title, onClick }: ProjectCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center text-center 
                 rounded-lg overflow-hidden border border-gray-200 
                 hover:shadow-md hover:border-teal-400 transition cursor-pointer"
    >
      <div className="w-full h-[120px] bg-gray-200 flex items-center justify-center">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </div>
      <p className="py-2 text-sm font-medium text-gray-700">{title}</p>
    </button>
  );
};

export default ProjectCard;
