import starImg from '../../assets/images/fluent-color_star-16.png';

export default function ProjectCard() {
  return (
    <div className="h-[340px] w-[320px] rounded hover:bg-[#f2f2f2] hover:rounded-[20px] flex flex-col justify-center items-center">
      <div>
        <div className="bg-gray-200 h-[190px] w-[280px] mb-2 rounded-[20px]"></div>
        <h3 className="font-pretendard font-semibold text-[24px]">전국 출장 음식사진 전문</h3>
        <div className="flex items-center gap-1">
          <img src={starImg} alt="star" className="w-4 h-4" />
          <div className="text-sm text-[#666666]">4.6 (1,222)</div>
        </div>
        <div>140,000원~</div>
        <div className="text-[#666666]">| 스튜디오 포토칩</div>
      </div>
    </div>
  );
}
