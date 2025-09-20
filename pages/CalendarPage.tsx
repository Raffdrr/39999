import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataStore, useUIStore } from '../stores';

const CalendarPage: React.FC = () => {
  const { events } = useDataStore();
  const { openModal } = useUIStore();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  const todayFull = new Date();
  todayFull.setHours(0, 0, 0, 0);
  const todayDate = todayFull.getDate();
  const todayMonth = todayFull.getMonth();
  const todayYear = todayFull.getFullYear();

  const monthDays = daysInMonth(currentMonthDate);
  let firstDay = firstDayOfMonth(currentMonthDate);
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: monthDays }, (_, i) => i + 1);
  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentMonthDate.getMonth() && eventDate.getFullYear() === currentMonthDate.getFullYear();
  });

  return (
    <div className="animate-page-content-enter flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
        <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 transition-colors"><ChevronLeft size={22} className="text-slate-600" /></button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-700 text-center">
          {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 transition-colors"><ChevronRight size={22} className="text-slate-600" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs sm:text-sm font-medium text-slate-500 mb-1.5 sm:mb-2">
        {daysOfWeek.map(day => <div key={day}>{day.slice(0, 3)}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 overflow-y-auto no-scrollbar">
        {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-50/70 rounded-md sm:rounded-lg"></div>)}
        {days.map(day => {
          const isToday = day === todayDate && currentMonthDate.getMonth() === todayMonth && currentMonthDate.getFullYear() === todayYear;
          const dayEvents = monthEvents.filter(e => new Date(e.date).getDate() === day);
          return (
            <div key={day} className={`p-1.5 sm:p-2 border rounded-md sm:rounded-lg min-h-[64px] sm:min-h-[80px] flex flex-col ${isToday ? `bg-gradient-to-br from-rose-200 via-rose-100 to-rose-50 border-rose-300 shadow-md` : 'bg-white/80 border-slate-200/80 hover:shadow-sm transition-shadow'}`}>
              <span className={`font-semibold text-xs sm:text-sm ${isToday ? `text-rose-700` : 'text-slate-700'}`}>{day}</span>
              <div className="mt-1 space-y-1 flex-1 overflow-y-auto no-scrollbar">
                {dayEvents.map(e => (
                  <div key={e.id} onClick={() => openModal('selectedEvent', e.id)} title={e.name}
                    className={`text-[9px] sm:text-[10px] p-1 rounded ${e.isCharityEvent ? 'bg-pink-400/90 hover:bg-pink-500/90' : `bg-rose-400/90 hover:bg-rose-500/90`} text-white font-medium truncate cursor-pointer transition-colors`}>
                    {e.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
