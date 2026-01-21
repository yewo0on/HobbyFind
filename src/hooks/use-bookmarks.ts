'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';

export function useBookmarks() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      setBookmarkedIds([]);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/bookmarks');
        if (!res.ok) {
          const errorData = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[useBookmarks] Failed to fetch bookmarks:', res.status, errorData);
          return;
        }
        const data = (await res.json()) as { hobbyIds: string[] };
        setBookmarkedIds(data.hobbyIds ?? []);
      } catch (error) {
        console.error('[useBookmarks] Network error while fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [status]);

  const isBookmarked = useCallback(
    (hobbyId: string) => bookmarkedIds.includes(hobbyId),
    [bookmarkedIds],
  );

  const toggleBookmark = useCallback(
    async (hobbyId: string) => {
      if (status !== 'authenticated') {
        toast({
          title: '로그인이 필요합니다.',
          description: '북마크 기능은 로그인 후 이용할 수 있어요.',
        });
        return;
      }

      const currentlyBookmarked = bookmarkedIds.includes(hobbyId);
      const nextIds = currentlyBookmarked
        ? bookmarkedIds.filter((id) => id !== hobbyId)
        : [...bookmarkedIds, hobbyId];

      setBookmarkedIds(nextIds);

      try {
        const res = await fetch('/api/bookmarks', {
          method: currentlyBookmarked ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hobbyId }),
        });

        if (!res.ok) {
          const errorData = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[useBookmarks] API error:', res.status, errorData);
          // 실패 시 상태 롤백
          setBookmarkedIds(bookmarkedIds);
          toast({
            title: '북마크 처리에 실패했어요.',
            description: errorData.error || '잠시 후 다시 시도해주세요.',
          });
        } else {
          // 성공 시 북마크 목록 다시 불러오기 (서버 상태와 동기화)
          const refreshRes = await fetch('/api/bookmarks');
          if (refreshRes.ok) {
            const refreshData = (await refreshRes.json()) as { hobbyIds: string[] };
            setBookmarkedIds(refreshData.hobbyIds ?? []);
          }
        }
      } catch (error) {
        console.error('[useBookmarks] Network error:', error);
        setBookmarkedIds(bookmarkedIds);
        toast({
          title: '네트워크 오류',
          description: '잠시 후 다시 시도해주세요.',
        });
      }
    },
    [bookmarkedIds, status, toast],
  );

  return {
    bookmarkedIds,
    isBookmarked,
    toggleBookmark,
    isLoading,
  };
}

