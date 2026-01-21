'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { HOBBIES, CATEGORY_LABEL, type HobbyCategory } from '@/constants/hobbies';
import HobbyCard from '@/components/HobbyCard';

type SummaryItem = {
  category: HobbyCategory;
  label: string;
  count: number;
};

const CATEGORY_COLORS: Record<HobbyCategory, string> = {
  sports: '#f97373',
  intellectual: '#60a5fa',
  art: '#a855f7',
};

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      const callbackUrl = encodeURIComponent('/mypage');
      router.push(`/login?callbackUrl=${callbackUrl}`);
    },
  });

  const [bookmarkedHobbyIds, setBookmarkedHobbyIds] = useState<string[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchBookmarks = async () => {
      try {
        setIsLoadingBookmarks(true);
        const res = await fetch('/api/bookmarks');
        if (!res.ok) {
          // 인증 실패 등은 세션 훅에서 처리하므로 여기서는 조용히 무시
          return;
        }
        const data = (await res.json()) as { hobbyIds: string[] };
        setBookmarkedHobbyIds(data.hobbyIds ?? []);
      } catch {
        // 네트워크 오류는 일단 무시
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    fetchBookmarks();
  }, [session?.user?.id]);

  const bookmarkedHobbies = useMemo(() => {
    if (!bookmarkedHobbyIds.length) return [] as typeof HOBBIES;
    return HOBBIES.filter((hobby) => bookmarkedHobbyIds.includes(hobby.id));
  }, [bookmarkedHobbyIds]);

  const summary: SummaryItem[] = useMemo(() => {
    const counts: Record<HobbyCategory, number> = {
      sports: 0,
      intellectual: 0,
      art: 0,
    };

    bookmarkedHobbies.forEach((hobby) => {
      counts[hobby.category] += 1;
    });

    return (Object.keys(counts) as HobbyCategory[]).map((category) => ({
      category,
      label: CATEGORY_LABEL[category],
      count: counts[category],
    }));
  }, [bookmarkedHobbies]);

  const hasBookmarks = bookmarkedHobbies.length > 0;

  if (status === 'loading') {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grayBg px-4 py-10">
        <p className="text-sm text-textSecondary">마이페이지를 불러오는 중입니다...</p>
      </main>
    );
  }

  return (
    <main className="bg-grayBg px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row">
        <section className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
          <header className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              My Page
            </p>
            <h1 className="mt-2 text-2xl font-bold text-textPrimary sm:text-3xl">
              {session?.user?.email || '마이페이지'}
            </h1>
            <p className="mt-2 text-sm text-textSecondary">
              북마크한 취미를 한눈에 모아보고, 나만의 취미 컬렉션을 관리해보세요.
            </p>
          </header>

          {isLoadingBookmarks ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <p className="text-xs text-textSecondary">
                북마크를 불러오는 중입니다...
              </p>
            </div>
          ) : hasBookmarks ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {bookmarkedHobbies.map((hobby) => (
                <HobbyCard key={hobby.id} hobby={hobby} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-grayBorder bg-grayBg px-6 py-10 text-center">
              <p className="mb-2 text-sm font-medium text-textPrimary">
                아직 북마크한 취미가 없습니다.
              </p>
              <p className="mb-4 text-xs text-textSecondary">
                홈 또는 카테고리 페이지에서 마음에 드는 취미를 북마크해보세요.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                취미 탐색하러 가기
              </button>
            </div>
          )}
        </section>

        <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-textPrimary">
            카테고리별 북마크 통계
          </h2>
          <p className="mb-6 text-xs text-textSecondary">
            운동형 · 지능형 · 예술형 중 어떤 취미를 더 많이 즐기고 있는지 확인해보세요.
          </p>

          {hasBookmarks ? (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {summary.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}개`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-grayBorder bg-grayBg px-4 py-6 text-center">
              <p className="mb-2 text-sm font-medium text-textPrimary">
                아직 보여줄 통계가 없어요.
              </p>
              <p className="text-xs text-textSecondary">
                취미를 북마크하면, 이곳에서 카테고리별 북마크 분포를 확인할 수 있습니다.
              </p>
            </div>
          )}

          <ul className="mt-6 space-y-2">
            {summary.map((item) => (
              <li
                key={item.category}
                className="flex items-center justify-between text-xs text-textSecondary"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                  />
                  <span>{item.label}</span>
                </div>
                <span className="font-medium text-textPrimary">
                  {item.count}개
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

