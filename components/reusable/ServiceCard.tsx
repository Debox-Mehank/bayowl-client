type CardProps = {
  title: string;
  onClick: () => void;
};

function ServiceCard({ title, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      data-aos="fade-up"
      className="h-40 w-40  bg-white/5 hover:bg-white/20 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg text-white z-20 text-md md:text-xl"
    >
      {title}
    </button>
  );
}

export default ServiceCard;
