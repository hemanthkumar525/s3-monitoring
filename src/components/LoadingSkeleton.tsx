import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-48 glass rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 glass rounded-2xl w-full" />
        ))}
      </div>
    </div>
  );
};
