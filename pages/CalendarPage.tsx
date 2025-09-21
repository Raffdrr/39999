import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataStore, useUIStore } from '../stores';

const CalendarPage: React.FC = () => {
  const { events } = useDataStore();
  const { openModal } = useUIStore();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return day === 0 ? 6 : day - 1; // Monday is 0, Sunday is 6
  };
  const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const todayFull = new Date();
  todayFull.setHours(0, 0, 0, 0);
  const todayDate = todayFull.getDate();
  const todayMonth = todayFull.getMonth();
  const todayYear = todayFull.getFullYear();

  const monthDays = daysInMonth(currentMonthDate);
  const firstDay = firstDayOfMonth(currentMonthDate);

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: monthDays }, (_, i) => i + 1);
  
  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentMonthDate.getMonth() && eventDate.getFullYear() === currentMonthDate.getFullYear();
  });

  const handleDayClick = (day: number) => {
    const dayEvents = monthEvents.filter(e => new Date(e.date).getDate() === day);
    if (dayEvents.length > 0) {
      // FIX: Use 'modalView' to open events, allowing for swiping between multiple events on the same day.
      const eventIds = dayEvents.map(e => `event_${e.id}`);
      openModal('modalView', { list: eventIds, index: 0 });
    }
  };

  return (
    <div className="animate-page-content-enter flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
        <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronLeft size={22} className="text-slate-600 dark:text-slate-300" /></button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 text-center">
          {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChevronRight size={22} className="text-slate-600 dark:text-slate-300" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 sm:mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 overflow-y-auto no-scrollbar">
        {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-100/70 dark:bg-slate-800/20 rounded-md sm:rounded-lg"></div>)}
        {days.map(day => {
          const isToday = day === todayDate && currentMonthDate.getMonth() === todayMonth && currentMonthDate.getFullYear() === todayYear;
          const dayEvents = monthEvents.filter(e => new Date(e.date).getDate() === day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`relative pt-2 border rounded-md sm:rounded-lg min-h-[64px] sm:min-h-[80px] flex flex-col items-center transition-all duration-200 ease-out
                ${isToday ? 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700/60 shadow-inner' : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'}
                ${hasEvents ? 'cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 active:scale-95 active:bg-orange-100 dark:active:bg-slate-600' : ''}
              `}>
              <span className={`font-semibold text-xs sm:text-sm w-6 h-6 flex items-center justify-center rounded-full
                ${isToday ? 'bg-orange-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-200'}
              `}>
                {day}
              </span>
              {hasEvents && (
                <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
