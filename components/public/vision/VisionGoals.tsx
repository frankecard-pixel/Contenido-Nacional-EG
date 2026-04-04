import React from 'react';

const VisionGoals: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
      {[
        { 
          title: "Capacidad Técnica", 
          desc: "Aumentar al 90% la participación de mano de obra nacional en puestos técnicos especializados mediante formación continua.",
          icon: "🛠️"
        },
        { 
          title: "Inclusión de PYMES", 
          desc: "Garantizar que al menos el 50% de los servicios auxiliares offshore sean provistos por empresas 100% de capital nacional.",
          icon: "🏗️"
        },
        { 
          title: "Digitalización Estatal", 
          desc: "Plataforma centralizada para auditoría en tiempo real del cumplimiento de las operadoras petroleras.",
          icon: "💻"
        }
      ].map((v, i) => (
        <div key={i} className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all">
          <div className="text-4xl mb-6">{v.icon}</div>
          <h3 className="text-xl font-black text-slate-900 mb-4">{v.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default VisionGoals;
