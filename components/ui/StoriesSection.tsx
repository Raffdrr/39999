import React from 'react';
import { Story } from '../../types';
import { STORIES_DATA } from '../../constants';

const StoriesSection: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Promo dai Locali</h2>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {STORIES_DATA.map((story: Story) => (
          <div key={story.id} className="flex-shrink-0 w-20 text-center group cursor-pointer">
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shadow-md transition-transform group-hover:scale-105">
              <img src={story.image} alt={story.title} className="w-full h-full object-cover rounded-full border-2 border-white" />
            </div>
            <p className="text-[11px] leading-tight text-slate-600 mt-1.5 truncate font-medium">{story.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;