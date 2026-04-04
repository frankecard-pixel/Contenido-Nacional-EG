import React from 'react';

interface TrainingCentersProps {
  centers: any[];
}

const TrainingCenters: React.FC<TrainingCentersProps> = ({ centers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
      {centers.map(center => (
        <div key={center.id} className="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all">
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <img src={center.image} className="absolute inset-0 w-full h-full object-cover" alt={center.name} />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[9px] font-black uppercase text-blue-700 tracking-widest">{center.location}</div>
          </div>
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{center.name}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Capacidad: {center.capacity}</p>
            <div className="space-y-3 mb-8">
              {center.specialties.map((spec: string) => (
                <div key={spec} className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span className="text-xs font-bold text-slate-600">{spec}</span>
                </div>
              ))}
            </div>
            <button className="bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-colors">Ver Cursos Disponibles</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainingCenters;
