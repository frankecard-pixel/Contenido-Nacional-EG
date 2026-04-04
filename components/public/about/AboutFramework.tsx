import React from 'react';

const AboutFramework: React.FC = () => {
  const ministryImage = "https://upload.wikimedia.org/wikipedia/commons/f/fe/Ministry_of_Mines_and_Hydrocarbons_%28Equatorial_Guinea%29.jpg";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-32 items-center">
       <div className="relative">
          <div className="absolute -inset-10 bg-blue-600/5 blur-[80px] rounded-full"></div>
          <div className="relative bg-white p-4 md:p-8 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden">
            <img src={ministryImage} className="w-full h-full object-cover rounded-[2rem] md:rounded-[3rem]" alt="Ministerio de Hidrocarburos y Desarrollo Minero" />
          </div>
       </div>
       <div className="px-2 md:px-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-8 md:mb-12 tracking-tighter">Nuestro Marco Institucional</h2>
          <div className="space-y-8 md:space-y-12">
            {[
              { title: "SOBERANÍA TECNOLÓGICA", desc: "Asegurar que el conocimiento técnico de la industria petrolera sea absorbido y replicado por expertos nacionales." },
              { title: "EMPODERAMIENTO LOCAL", desc: "Facilitar el acceso de las PYMES nacionales a contratos de alto valor mediante asistencia técnica y financiera." },
              { title: "GOBERNANZA TRANSPARENTE", desc: "Digitalizar todos los procesos de certificación y auditoría para eliminar barreras burocráticas." }
            ].map((item, i) => (
              <div key={i} className="flex space-x-8 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black flex-shrink-0 text-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight group-hover:text-blue-700 transition-colors leading-none">{item.title}</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

export default AboutFramework;
