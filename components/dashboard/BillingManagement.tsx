import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Download, ExternalLink, Plus, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const BillingManagement: React.FC = () => {
  const { t } = useTranslation();

  const invoices = [
    { id: 'INV-001', date: '2024-03-01', amount: '$1,200.00', status: 'paid', method: 'Visa •••• 4242' },
    { id: 'INV-002', date: '2024-02-01', amount: '$850.00', status: 'paid', method: 'Visa •••• 4242' },
    { id: 'INV-003', date: '2024-01-01', amount: '$450.00', status: 'paid', method: 'Visa •••• 4242' },
    { id: 'INV-004', date: '2023-12-01', amount: '$1,500.00', status: 'overdue', method: 'Transferencia Bancaria' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Facturación y Pagos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Control de pagos, facturas y presupuestos de publicidad.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Añadir Método de Pago
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
              <CreditCard className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-8">Método de Pago Predeterminado</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight">Visa Platinum</p>
                  <p className="text-xs font-bold opacity-60">•••• •••• •••• 4242</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Expira</p>
                  <p className="text-sm font-black">12/26</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all">Editar</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase mb-6 tracking-tight">Resumen de Saldo</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Saldo Pendiente</p>
                <p className="text-xl font-black text-rose-600 tracking-tighter">$1,500.00</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Crédito Disponible</p>
                <p className="text-xl font-black text-emerald-600 tracking-tighter">$500.00</p>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Pagar Ahora</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Historial de Facturas</h3>
            <div className="flex gap-2">
              <button className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-5">Factura / Fecha</th>
                  <th className="px-8 py-5">Monto</th>
                  <th className="px-8 py-5">Método</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{inv.id}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{inv.date}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                      {inv.amount}
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {inv.method}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        <span className={`size-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {inv.status === 'paid' ? 'Pagada' : 'Vencida'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
