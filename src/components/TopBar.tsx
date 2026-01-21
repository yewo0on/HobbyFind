'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { path: '/sports', label: '운동형' },
  { path: '/intellectual', label: '지능형' },
  { path: '/art', label: '예술형' },
] as const;

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const getCurrentCategory = () => {
    if (pathname.startsWith('/sports')) return '/sports';
    if (pathname.startsWith('/intellectual')) return '/intellectual';
    if (pathname.startsWith('/art')) return '/art';
    return '';
  };

  const handleCategoryChange = (value: string) => {
    router.push(value);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-grayBorder bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          <span className="text-lg font-semibold text-textPrimary">
            HobbyFind
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Select
            value={getCurrentCategory() || undefined}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-auto w-auto border-none bg-transparent px-3 py-2 text-sm font-medium text-textSecondary shadow-none hover:text-textPrimary focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="카테고리">
                {getCurrentCategory()
                  ? CATEGORIES.find((c) => c.path === getCurrentCategory())
                      ?.label
                  : '카테고리'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.path} value={category.path}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {status === 'authenticated' ? (
            <div className="flex items-center gap-2">
              <Link
                href="/mypage"
                className="text-sm font-medium text-textSecondary hover:text-textPrimary"
              >
                마이페이지
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-grayBorder text-sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-textSecondary hover:text-textPrimary"
              >
                로그인
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                >
                  회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
