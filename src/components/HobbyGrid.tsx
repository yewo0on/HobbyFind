'use client';

import type { Hobby } from '@/constants/hobbies';

import HobbyCard from './HobbyCard';
import { useBookmarks } from '@/hooks/use-bookmarks';

interface HobbyGridProps {
  hobbies: Hobby[];
}

export default function HobbyGrid({ hobbies }: HobbyGridProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {hobbies.map((hobby) => (
          <HobbyCard
            key={hobby.id}
            hobby={hobby}
            isBookmarked={isBookmarked(hobby.id)}
            onToggleBookmark={() => toggleBookmark(hobby.id)}
          />
        ))}
      </div>
    </div>
  );
}
