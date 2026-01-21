-- 0002_create_bookmarks_table.sql
-- HobbyFind 북마크 테이블 및 RLS 정책 생성

BEGIN;

-- bookmarks 테이블: 한 사용자의 한 취미에 대해 한 개의 북마크만 허용
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookmarks_user_hobby_unique UNIQUE (user_id, hobby_id)
);

-- updated_at 자동 갱신 함수 (이미 존재해도 덮어써도 무방)
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- bookmarks 테이블용 updated_at 트리거
DROP TRIGGER IF EXISTS set_updated_at_bookmarks ON public.bookmarks;

CREATE TRIGGER set_updated_at_bookmarks
BEFORE UPDATE ON public.bookmarks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

-- Row Level Security 활성화
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 자신의 북마크만 조회/수정/삭제/추가 가능하도록 정책 설정
DO $policy$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookmarks'
      AND policyname = 'users_manage_own_bookmarks'
  ) THEN
    CREATE POLICY users_manage_own_bookmarks
    ON public.bookmarks
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$policy$;

COMMIT;

