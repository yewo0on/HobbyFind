# Design Guide — HobbyFind 

*(Inspired by Airbnb Design System)*

---

## 1. 디자인 시스템 개요 (Design System Overview)

### 1-1. 브랜드 아이덴티티

* **키워드**: 친근함 · 여백 · 명확한 정보 구조 · 탐색 중심
* **목표 인상**:
  “가볍게 둘러보다가 자연스럽게 취미를 발견하는 경험”
* **타깃 감성**: Airbnb처럼 **과하지 않고 정돈된 미니멀 UI**

---

### 1-2. 톤앤매너 (Tone & Manner)

| 요소   | 가이드                  |
| ---- | -------------------- |
| 텍스트  | 짧고 직관적, 대화체 지양       |
| 여백   | 넉넉한 padding / margin |
| 컬러   | 밝은 배경 + 포인트 컬러 절제    |
| 인터랙션 | 부드러운 hover, 빠른 반응    |

---

### 1-3. UI 키 비주얼

* 둥근 카드 (rounded-xl)
* 약한 그림자 (shadow-sm ~ shadow-md)
* 선보다는 **공간 분리(여백)** 위주

---

## 2. TailwindCSS 색상 팔레트 (Color Palette)

### 2-1. 브랜드 컬러 정의

```js
// tailwind.config.js (concept)
colors: {
  primary: '#FF385C',     // Airbnb Red 계열
  primarySoft: '#FFE4E8',

  grayBg: '#F7F7F7',
  grayBorder: '#E5E7EB',

  textPrimary: '#222222',
  textSecondary: '#717171',

  white: '#FFFFFF',
}
```

---

### 2-2. 컬러 사용 가이드

| 용도     | Tailwind 예시              |
| ------ | ------------------------ |
| 전체 배경  | `bg-white` / `bg-grayBg` |
| 주요 텍스트 | `text-textPrimary`       |
| 보조 텍스트 | `text-textSecondary`     |
| 강조 요소  | `text-primary`           |
| 버튼 배경  | `bg-primary`             |
| 경계선    | `border-grayBorder`      |

---

## 3. 페이지 구현 가이드 (Page Implementations)

---

### 3-1. 루트페이지 (Home)

#### 구조

```
Top Bar
Hero Section
Main Content (Hobby Grid)
```

#### Hero 섹션 가이드

* 중앙 정렬
* 큰 타이포 + 여백 강조
* framer-motion을 이용한 fade in 애니메이션 적용
* 단색 배경 및 애니메이션 블러 효과

```html
<section class="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-20">
  <div class="absolute inset-0 bg-grayBg" />
  <!-- 애니메이션 블러 효과 (primarySoft 사용) -->
  <div class="relative z-10 mx-auto max-w-4xl text-center">
    <!-- 배지 -->
    <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 shadow-lg">
      <Icon class="h-5 w-5 text-white" />
      <span class="text-sm font-semibold text-white">오늘부터 시작하는 나만의 이야기</span>
    </div>
    <!-- 메인 제목 -->
    <h1 class="mb-6 text-4xl font-bold text-textPrimary sm:text-5xl md:text-6xl lg:text-7xl">
      평범한 일상에
      <br />
      <span class="text-primary">
        색을 더하다
      </span>
    </h1>
    <!-- 서브 설명 -->
    <p class="mx-auto mb-10 max-w-2xl text-base text-textSecondary sm:text-lg md:text-xl">
      몸을 움직이는 즐거움, 머리를 쓰는 재미, 마음을 표현하는 기쁨.
      <br />
      당신의 라이프스타일에 딱 맞는 취미를 만나보세요!
    </p>
    <!-- 카테고리 배지 (primarySoft 배경, primary 아이콘) -->
    <!-- CTA 버튼 (bg-primary) -->
  </div>
</section>
```

#### Guide 섹션 가이드 (Home 전용)

* 위치: Hero 섹션 바로 아래, 취미 카드 그리드 위 영역
* 목적: "카테고리 페이지가 따로 있다"는 점을 안내하고 각 카테고리 페이지로 직접 이동 가능한 링크 제공
* 구성: 배지 + 제목 + 설명 + 카테고리별 카드 링크

```html
<section class="relative mx-auto max-w-7xl px-6 py-16">
  <div class="absolute inset-0 -z-10 bg-primarySoft rounded-3xl" />
  <div class="relative text-center">
    <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
      <Icon class="h-4 w-4 text-primary" />
      <span class="text-xs font-medium text-textSecondary">카테고리별 탐색</span>
    </div>
    <h2 class="mb-4 text-2xl font-bold text-textPrimary">관심 있는 취미를 더 집중해서 살펴보세요</h2>
    <p class="mb-8 text-base text-textSecondary">
      운동형, 지능형, 예술형 카테고리 페이지에서 원하는 취미를 찾아보세요
    </p>
    <!-- 카테고리별 카드 링크 (white 배경, grayBorder 테두리, primary 아이콘) -->
    <div class="flex flex-wrap items-center justify-center gap-4">
      <!-- 운동형, 지능형, 예술형 카테고리 링크 카드 -->
    </div>
  </div>
</section>
```

---

### 3-2. 카테고리 페이지

* 각 카테고리별 **고유 색상 테마를 가진 Hero 섹션**
* Tailwind 팔레트 `sports-*`, `intellectual-*`, `art-*`를 사용
* 탐색에 집중되는 단순 구조 유지

**카테고리 Hero 섹션 구성:**
* 파스텔 톤 배경 (카테고리별 색상 계열)
* 애니메이션 블러 효과 (배경과 같은 계열 색상, 펄스 애니메이션)
* 배지 (카테고리 아이콘 + 서브타이틀, 카테고리 메인 컬러 배경)
* 카테고리별 텍스트 색상 (예: `text-sports-600` 등)
* 카테고리별 설명 문구 (textSecondary)

**카테고리별 색상 테마 예시:**
* 운동형(sports): 파스텔 핑크 계열 배경 (`bg-sports-50`), 진한 핑크 배지 (`bg-sports-500`), 제목 색상 `text-sports-600`
* 지능형(intellectual): 파스텔 블루 계열 배경 (`bg-intellectual-50`), 블루 배지 (`bg-intellectual-500`), 제목 색상 `text-intellectual-600`
* 예술형(art): 파스텔 퍼플 계열 배경 (`bg-art-50`), 퍼플 배지 (`bg-art-500`), 제목 색상 `text-art-600`

```html
<section class="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-20">
  <div class="absolute inset-0 bg-sports-50" />
  <!-- 애니메이션 블러 효과: 같은 계열의 연한 색상 사용 -->
  <div class="relative z-10 mx-auto max-w-4xl text-center">
    <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-sports-500 px-5 py-2.5 shadow-lg">
      <Icon class="h-5 w-5 text-white" />
      <span class="text-sm font-semibold text-white">활기찬 하루를 시작하세요</span>
    </div>
    <h1 class="mb-6 text-4xl font-bold text-textPrimary sm:text-5xl md:text-6xl lg:text-7xl">
      <span class="text-sports-600">
        운동형 취미
      </span>
    </h1>
    <p class="mx-auto mb-10 max-w-2xl text-base text-textSecondary sm:text-lg md:text-xl">
      몸을 움직이며 에너지를 발산하고, 건강한 라이프스타일을 만들어가세요.
    </p>
  </div>
</section>
```

---

## 4. 레이아웃 컴포넌트 (Layout Components)

---

### 4-1. Top Bar (Header)

* 항상 고정 (sticky)
* 배경은 white, 그림자 최소
* 카테고리 필터는 **Select 드롭다운 형태**로 구현

```html
<header class="sticky top-0 z-50 bg-white border-b border-grayBorder">
  <div class="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
    <Link href="/" class="flex items-center gap-2">
      <Icon class="h-5 w-5 fill-primary text-primary" />
      <span class="text-lg font-semibold text-textPrimary">HobbyFind</span>
    </Link>
    <Select>
      <SelectTrigger class="h-auto w-auto border-none bg-transparent">
        <SelectValue placeholder="카테고리">
          <!-- 현재 카테고리 페이지일 경우 카테고리명 표시, 아닐 경우 "카테고리" 표시 -->
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="/sports">운동형</SelectItem>
        <SelectItem value="/intellectual">지능형</SelectItem>
        <SelectItem value="/art">예술형</SelectItem>
      </SelectContent>
    </Select>
  </div>
</header>
```

#### Top Bar 동작 가이드

* Select에서 항목 선택 시 해당 카테고리 페이지로 이동
* 루트 페이지에서는 "카테고리"로 표시
* 카테고리 페이지에서는 해당 카테고리명이 Select에 표시됨

---

### 4-2. 카드 컴포넌트 (Hobby Card)

* Airbnb 스타일 핵심 요소
* **Hover 시 살짝 떠오르는 느낌**
* 카테고리 배지: 카테고리별 색상 팔레트 사용
  * 운동형: `bg-sports-100 text-sports-700`
  * 지능형: `bg-intellectual-100 text-intellectual-700`
  * 예술형: `bg-art-100 text-art-700`

```html
<article class="rounded-xl border border-grayBorder bg-white p-4 
            transition hover:shadow-md hover:-translate-y-1">
  <!-- 이미지 영역 -->
  <div class="relative mb-3 h-48 w-full overflow-hidden rounded-lg">
    <img src="..." alt="..." class="object-cover" />
  </div>
  <div>
    <!-- 카테고리 배지 (예: 운동형) -->
    <span class="inline-block rounded-full bg-sports-100 text-sports-700 px-3 py-1 text-xs font-semibold border border-grayBorder">
      운동형
    </span>
    <h3 class="mt-2 font-medium text-textPrimary">클라이밍</h3>
    <p class="mt-1 text-sm text-textSecondary">설명 텍스트</p>
  </div>
</article>
```

---

### 4-3. 그리드 레이아웃

```html
<div class="grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4">
```

---

## 5. 상호작용 패턴 (Interaction Patterns)

### 5-1. 버튼 & 필터

| 상태     | 가이드                        |
| ------ | -------------------------- |
| 기본     | 텍스트 버튼                     |
| Hover  | 색상 변경                      |
| Active | `text-primary font-medium` |

```html
<button class="px-3 py-1 rounded-full 
               hover:bg-grayBg
               text-primary font-medium">
```

---

### 5-2. 카드 인터랙션

* Hover: elevation + 이동
* Click: 페이지 전환 (즉각 반응)

---

### 5-3. 페이지 전환 및 로드 애니메이션

* framer-motion을 활용한 **fade in 애니메이션** (페이지 로드 시)
* Hero 섹션 요소들의 순차적 fade in 효과
* 자연스러운 콘텐츠 변경 중심
* 카테고리 Hero 섹션의 펄스 애니메이션 블러 효과

---

## 6. 반응형 브레이크포인트 (Breakpoints)

### Tailwind 기본 기준

| 구분      | breakpoint    | UI 변화   |
| ------- | ------------- | ------- |
| Mobile  | `sm < 640px`  | 1열 카드   |
| Tablet  | `md ≥ 768px`  | 2~3열 카드 |
| Desktop | `lg ≥ 1024px` | 4열 카드   |
| Wide    | `xl / 2xl`    | 여백 확장   |

---

### 모바일 가이드
* Top Bar 버튼 간격 축소
* Hero 텍스트 크기 감소
* 카드 터치 영역 확보 (`min-h`)
