'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setSubmitError('아이디 또는 비밀번호를 확인해주세요.');
      return;
    }

    router.push(result.url ?? '/');
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grayBg px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-textPrimary">로그인</h1>
        <p className="mb-6 text-sm text-textSecondary">
          북마크와 마이페이지 기능을 이용하려면 로그인이 필요해요.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
            )}

            <Button
              type="submit"
              className="mt-2 w-full bg-primary text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-textSecondary">
          아직 계정이 없나요?{' '}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}

