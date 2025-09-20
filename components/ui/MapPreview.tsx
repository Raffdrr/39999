import React from 'react';
import { MapPin, Maximize2 } from 'lucide-react';
import { MAP_PLACEHOLDER } from '../../constants';
import { useUIStore } from '../../stores';

const MapPreview: React.FC = () => {
  const { openModal } = useUIStore();

  return (
    <div
      className="mb-6 h-48 sm:h-56 w-full rounded-2xl overflow-hidden relative shadow-xl group bg-slate-400 cursor-pointer transition-all duration-300 hover:shadow-2xl"
      onClick={() => openModal('isGlobalMapOpen', true)}
    >
      <img
        src={MAP_PLACEHOLDER}
        alt="Anteprima Mappa Locale"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x400/e0e0e0/757575?text=Mappa`; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-colors duration-300"></div>
      <MapPin className="absolute text-white top-3 right-3 sm:top-5 sm:right-5 h-6 w-6 sm:h-8 sm:w-8 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-semibold flex items-center gap-1 sm:gap-1.5 shadow-md transition-all duration-300 group-hover:bg-black/80 group-hover:scale-105">
        <Maximize2 size={10} /> Esplora la Mappa
      </div>
    </div>
  );
};

export default MapPreview;