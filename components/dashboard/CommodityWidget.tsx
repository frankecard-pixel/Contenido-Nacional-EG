import React, { useState, useEffect } from 'react';
import { Droplet, Flame, Leaf, DollarSign } from 'lucide-react';

const CommodityWidget: React.FC = () => {
  const [prices, setPrices] = useState({
    oil: 85.20,
    gas: 2.45,
    carbon: 65.10,
    gold: 2350.50
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        oil: prev.oil + (Math.random() - 0.5) * 0.5,
        gas: prev.gas + (Math.random() - 0.5) * 0.05,
        carbon: prev.carbon + (Math.random() - 0.5) * 0.2,
        gold: prev.gold + (Math.random() - 0.5) * 5
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: 'Barril (Brent)', value: prices.oil.toFixed(2), icon: Droplet, color: 'text-blue-500' },
    { label: 'Gas Natural', value: prices.gas.toFixed(2), icon: Flame, color: 'text-orange-500' },
    { label: 'Carbono', value: prices.carbon.toFixed(2), icon: Leaf, color: 'text-emerald-500' },
    { label: 'Oro (oz)', value: prices.gold.toFixed(2), icon: DollarSign, color: 'text-yellow-500' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] md:rounded-full p-4 md:px-8 md:py-4 shadow-sm border border-slate-100 dark:border-slate-700 grid grid-cols-2 md:flex md:items-center md:justify-between gap-3 md:gap-8 my-6 w-full max-w-full overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 md:gap-3 min-w-0">
          <item.icon className={`size-4 shrink-0 ${item.color}`} />
          <div className="flex flex-col xl:flex-row xl:items-center gap-0 xl:gap-2 truncate">
            <span className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
              {item.label}
            </span>
            <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white tracking-tight leading-loose md:leading-none">
              ${item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommodityWidget;
