import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Maximize2 } from 'lucide-react';

interface ThreeSixtyViewerProps {
  imageUrl: string;
  title: string;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl, title }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotation(prev => prev + e.movementX * 0.5);
  };

  return (
    <div className="relative group cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 aspect-square">
      <motion.div
        className="w-full h-full"
        style={{ rotateY: rotation }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <RotateCw size={14} className="animate-spin-slow" />
        360° VIEW ACTIVE
      </div>

      <button className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
        <Maximize2 size={18} />
      </button>
    </div>
  );
};

export default ThreeSixtyViewer;
