import React from 'react';

interface SocialProjectDetailHeaderProps {
  image: string;
  title: string;
}

const SocialProjectDetailHeader: React.FC<SocialProjectDetailHeaderProps> = ({ image, title }) => {
  return (
    <div className="h-[400px] relative">
      <img src={image} className="w-full h-full object-cover" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-10 left-10 text-white">
          <span className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2 block">Inversión Social</span>
          <h1 className="text-5xl font-black">{title}</h1>
      </div>
    </div>
  );
};

export default SocialProjectDetailHeader;
