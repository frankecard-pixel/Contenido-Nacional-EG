import React from 'react';

interface LegalDetailArticleProps {
  id: string;
  title: string;
  content: string;
}

const LegalDetailArticle: React.FC<LegalDetailArticleProps> = ({ id, title, content }) => {
  return (
    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
      <div className="flex items-center space-x-4 mb-6">
        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black">{id}</span>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed font-medium">{content}</p>
    </div>
  );
};

export default LegalDetailArticle;
