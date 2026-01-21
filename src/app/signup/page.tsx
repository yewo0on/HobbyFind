'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    agree: z.literal(true, {
      errorMap: () => ({ message: '이용 약관에 동의해주세요.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 서로 일치하지 않습니다.',
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/login';

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        setSubmitError('이미 가입된 이메일입니다.');
      } else {
        setSubmitError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }

    router.push(
      `${redirectTo}?email=${encodeURIComponent(values.email)}&justSignedUp=1`,
    );
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grayBg px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-textPrimary">회원가입</h1>
        <p className="mb-6 text-sm text-textSecondary">
          간단한 정보만으로 HobbyFind 계정을 만들 수 있어요.
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 한 번 더 입력하세요"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-grayBorder bg-grayBg px-3 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-textPrimary">
                      이용 약관에 동의합니다.
                    </FormLabel>
                    <p className="text-xs text-textSecondary">
                      교육용 프로젝트로, 이메일과 비밀번호 외의 개인정보는 수집하지 않습니다.
                    </p>
                  </div>
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
              {isSubmitting ? '회원가입 중...' : '회원가입'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-textSecondary">
          이미 계정이 있나요?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}

