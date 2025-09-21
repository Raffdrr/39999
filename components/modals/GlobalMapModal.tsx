
import React, { useState, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { X, AlertTriangle, Loader, ExternalLink } from 'lucide-react';
import FullScreenModalWrapper from './FullScreenModalWrapper';
import ImageWithFallback from '../ImageWithFallback';
import { useDataStore, useUIStore } from '../../stores';
import { Locale, Event } from '../../types';
import { MapPinIcon } from '../icons/secondary/MapPinIcon';
import { EventPinIcon } from '../icons/secondary/EventPinIcon';

type CombinedItem = (Locale & { itemType: 'locale' }) | (Event & { itemType: 'event' });

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 45.4642,
  lng: 9.1900,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  ],
};

const getMarkerIcon = (itemType: 'locale' | 'event') => {
    const IconComponent = itemType === 'locale' ? <MapPinIcon size={40} /> : <EventPinIcon size={40} />;
    const svgString = ReactDOMServer.renderToString(IconComponent);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
};

const GlobalMapModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { locales, events } = useDataStore();
  const { openModal } = useUIStore();
  const [activeItem, setActiveItem] = useState<CombinedItem | null>(null);
  
  const apiKey = process.env.API_KEY;

  const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: apiKey || "",
      // Prevent script from loading if API key is missing
      preventGoogleFontsLoading: true,
  });

  const combinedItems: CombinedItem[] = useMemo(() => [
    ...locales.filter(l => l.coords).map(l => ({ ...l, itemType: 'locale' as const })),
    ...events
        .filter(e => e.coords && new Date(e.date) >= new Date())
        .map(e => ({ ...e, itemType: 'event' as const })),
  ], [locales, events]);

  const itemIdsForModalView = useMemo(() => combinedItems.map(item => `${item.itemType}_${item.id}`), [combinedItems]);

  const handleViewDetails = (item: CombinedItem) => {
    const itemId = `${item.itemType}_${item.id}`;
    const itemIndex = itemIdsForModalView.indexOf(itemId);
    if (itemIndex !== -1) {
      onClose();
      setTimeout(() => {
        openModal('modalView', { list: itemIdsForModalView, index: itemIndex });
      }, 300);
    }
  };

  const renderContent = () => {
    if (!apiKey) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-800 text-white">
          <div className="text-center p-4">
            <AlertTriangle size={48} className="mx-auto mb-4 text-amber-400" />
            <h3 className="text-xl font-bold">Configurazione Mappa Mancante</h3>
            <p className="text-slate-300 mt-2 max-w-sm">Per visualizzare la mappa, è necessario creare e impostare una chiave API di Google Maps nella variabile d'ambiente `API_KEY`.</p>
             <a 
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-colors"
            >
              Crea una Chiave API <ExternalLink size={16} />
            </a>
          </div>
        </div>
      );
    }
    
    if (loadError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-800 text-white">
          <div className="text-center p-4">
            <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold">Errore di Caricamento Mappa</h3>
            <p className="text-slate-300 mt-2 max-w-md">
              L'app ha ricevuto un errore da Google Maps (<code className="bg-slate-700 text-red-300 px-1 py-0.5 rounded text-xs font-mono">InvalidKeyMapError</code>), che indica un problema con la chiave API.
            </p>
            <p className="text-slate-300 mt-2 max-w-md">
              Per favore, verifica i seguenti punti nel tuo progetto Google Cloud:
            </p>
            <ul className="list-disc list-inside text-left text-slate-400 text-sm mt-3 space-y-1 max-w-md mx-auto">
                <li>La chiave API è corretta e non ha errori di battitura.</li>
                <li>L'API "Maps JavaScript API" è abilitata.</li>
                <li>La fatturazione è attiva per il progetto.</li>
                <li>Le restrizioni della chiave (es. referrer HTTP) consentono a questo dominio di usarla.</li>
            </ul>
             <a 
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-colors"
            >
              Vai alla Google Cloud Console <ExternalLink size={16} />
            </a>
          </div>
        </div>
      );
    }
    
    if (!isLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-800 text-white">
           <Loader size={48} className="animate-spin text-slate-400" />
           <p className="mt-4 text-slate-300">Caricamento mappa...</p>
        </div>
      );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={mapOptions}
          >
            {combinedItems.map(item => (
              <MarkerF
                key={`${item.itemType}-${item.id}`}
                position={item.coords!}
                onClick={() => setActiveItem(item)}
                icon={{
                    url: getMarkerIcon(item.itemType),
                    scaledSize: new (window as any).google.maps.Size(40, 40),
                    anchor: new (window as any).google.maps.Point(20, 40),
                }}
              />
            ))}

            {activeItem && activeItem.coords && (
              <InfoWindowF
                position={activeItem.coords}
                onCloseClick={() => setActiveItem(null)}
                options={{
                  pixelOffset: new (window as any).google.maps.Size(0, -45),
                }}
              >
                <div className="w-full text-black p-1 bg-white rounded-lg">
                    <ImageWithFallback src={activeItem.img} alt={activeItem.name} containerClassName="w-full h-24 rounded-t-md" imgClassName="w-full h-full object-cover"/>
                    <div className="p-2">
                         <h4 className="font-bold text-sm text-slate-800 truncate">{activeItem.name}</h4>
                         <p className="text-xs text-slate-500">{activeItem.itemType === 'locale' ? (activeItem as Locale).cuisine : (activeItem as Event).category}</p>
                         <button onClick={() => handleViewDetails(activeItem)} className="w-full mt-2 text-xs font-semibold bg-orange-500 text-white py-1.5 rounded-md hover:bg-orange-600 transition-colors">
                            Vedi Dettagli
                         </button>
                    </div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
    );
  };

  return (
    <FullScreenModalWrapper open={true} onClose={onClose}>
        <div className="relative h-full w-full bg-slate-700">
          <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Mappa Globale</h2>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
              aria-label="Chiudi mappa"
            >
              <X size={24} />
            </button>
          </header>
          {renderContent()}
        </div>
    </FullScreenModalWrapper>
  );
};

export default GlobalMapModal;