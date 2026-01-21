-- 0001_create_profiles_table.sql
-- HobbyFind 프로필 테이블 생성 및 updated_at 트리거 설정

BEGIN;

-- 프로필 테이블 (Supabase auth.users 와 1:1 매핑)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at 자동 갱신 함수 (없으면 덮어써도 무방하므로 OR REPLACE 사용)
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거가 있으면 삭제 후 재생성 (idempotent)
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;

CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

COMMIT;
