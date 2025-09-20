import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react'; // Default icon

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  errorText?: string;
  imgClassName?: string;
  containerClassName?: string;
  errorIcon?: React.ElementType;
  itemKey?: string | number; // To help reset error state on src change for same component instance
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  errorText = "Immagine non disponibile",
  imgClassName,
  containerClassName,
  errorIcon: ErrorIcon = ImageOff,
  itemKey,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src, itemKey]);

  return (
    <div className={`relative ${containerClassName || ''} bg-slate-300 rounded-xl overflow-hidden group`}>
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500 text-xs p-2">
          <ErrorIcon className="h-1/2 w-auto max-h-8 sm:max-h-10 mb-1 text-slate-400" />
          {errorText}
        </div>
      ) : (
        <img
          key={itemKey ? `${itemKey}-${src}` : src} // Use itemKey to form a unique key with src
          src={src}
          alt={alt}
          className={`${imgClassName} transition-transform duration-300 group-hover:scale-105`}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default React.memo(ImageWithFallback);