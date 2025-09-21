
import React from 'react';
import { Locale, Event } from '../../types';
import { MapPinIcon, EventPinIcon } from '../icons/secondary';

interface MapMarkerProps {
  item: (Locale & { itemType: 'locale' }) | (Event & { itemType: 'event' });
  onClick: () => void;
  isSelected: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({ item, onClick, isSelected }) => {
  const isLocale = item.itemType === 'locale';
  const Icon = isLocale ? MapPinIcon : EventPinIcon;
  const pinColorClass = isLocale ? 'text-amber-500' : 'text-orange-600';

  return (
    <div 
      className={`transition-all duration-300 ease-out cursor-pointer group ${isSelected ? 'z-10' : 'z-0'}`}
      onClick={onClick}
    >
      <div className={`relative transition-transform duration-300 ${isSelected ? 'scale-125' : 'scale-100 group-hover:scale-110'}`}>
        <Icon size={isSelected ? 48 : 36} className={pinColorClass} />
      </div>
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-white text-xs font-bold whitespace-nowrap bg-black/70 px-2 py-1 rounded-md transition-all duration-200 pointer-events-none ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {item.name}
      </div>
    </div>
  );
};

export default MapMarker;
