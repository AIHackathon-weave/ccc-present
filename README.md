# 해커톤 작업 요약

> 커밋: `08b6b36` · 브랜치: `main` · 30개 파일, +4,309줄

---

## 구현 기능

### 1. 순모임 탭 강화

| 기능 | 파일 |
|------|------|
| 순장 모드 — 순모임 예약 (날짜·시간·알림·순원 선택) | `app/soon-meeting/leader.tsx` |
| 순원 모드 — 등록 순원만 입장, 예약 일정 확인 | `app/soon-meeting/member.tsx` |
| 순원 등록 모달 (검색·다중선택·확인) | `app/soon-meeting/leader.tsx` |
| 인앱 알림 배너 (예약 완료·순원 알림) | `app/soon-meeting/_layout.tsx` |

### 2. 캠퍼스 이벤트·출석 시스템

| 기능 | 파일 |
|------|------|
| 홈 탭 — 이번 주 캠퍼스 일정 카드 섹션 | `app/(tabs)/home/index.tsx` |
| 이벤트 상세 — 출석(출석/지각/불참·사유 입력) | `app/event/[id].tsx` |
| 이벤트 상세 — 순여행 참가 신청·취소·계좌 안내 | `app/event/[id].tsx` |
| 이벤트 생성·수정 (반복일정·특정일·신청기능) | `app/event/create.tsx` |
| 통계 화면 — 출석 현황·신청 명단 | `app/event/stats.tsx` |

### 3. 투표식 출석 시스템 (별도)

| 기능 | 파일 |
|------|------|
| 출석 목록·현황 화면 | `app/attendance/index.tsx` |
| 출석 대시보드 | `app/attendance/dashboard.tsx` |

---

## 신규 파일 목록

### 화면 (app/)
```
app/attendance/_layout.tsx
app/attendance/index.tsx
app/attendance/dashboard.tsx
app/event/_layout.tsx
app/event/[id].tsx
app/event/create.tsx
app/event/stats.tsx
app/soon-meeting/_header.tsx
app/soon-meeting/_layout.tsx
app/soon-meeting/index.tsx
app/soon-meeting/leader.tsx
app/soon-meeting/member.tsx
app/soon-meeting/review.tsx
```

### 스토어 (src/stores/)
```
attendance-store.ts       — 투표식 출석 상태
campus-event-store.ts     — 캠퍼스 이벤트·출석·신청 상태
meeting-reservation-store.ts — 순모임 예약 상태
meeting-store.ts          — 순모임 기록 상태
notification-banner-store.ts — 인앱 배너 알림 상태
soon-member-store.ts      — 순원 등록 상태
```

### 서비스 (src/services/)
```
campus-event.ts           — 이벤트 CRUD·출석·신청 (mock/Supabase 분기)
```

---

## 기존 파일 수정

| 파일 | 변경 내용 |
|------|----------|
| `app/(tabs)/home/index.tsx` | 캠퍼스 일정 섹션 추가 |
| `app/(tabs)/more/index.tsx` | 출석체크 퀵액션 제거 (캠퍼스 이벤트로 통합) |
| `app/_layout.tsx` | `attendance`, `event` 인증 그룹 추가 |
| `src/lib/permission.ts` | `canManageCampusEvents()`, `canViewEventStats()` 추가 |
| `src/mocks/data.ts` | 캠퍼스 이벤트·출석 mock 데이터 추가, 미사용 export 제거 |
| `src/types/database.ts` | `is_leadership?` 필드 추가 |

---

## 권한 체계

```
canManageCampusEvents() / canViewEventStats()
├── is_staff: true          → 간사님 (기존 체계 유지)
├── is_leadership: true     → 리더십 순장 (해커톤 확장, mock 전용)
│                             실서비스 전환 시 leader_appointments로 교체
└── canAccessOfficerFeature → 캠퍼스·지구 리더 임원 (기존 체계 유지)

접근 불가: 일반 순원, 일반 순장
```

---

## 주요 설계 원칙

- **Mock 모드 완전 동작**: `EXPO_PUBLIC_USE_MOCK=true` 설정 시 Supabase 없이 전체 기능 동작
- **서비스 레이어 분리**: UI는 `services/campus-event.ts`만 호출, 반응형 구독은 Zustand 훅
- **Cherry-pick 가능 구조**: 신규 기능은 별도 파일로 격리, 기존 파일 수정 최소화
- **Stats 반응성**: `getAttendanceStats()` 대신 `attendance` 배열 인라인 파생으로 즉시 반영

---

## GitHub Push

```bash
git push origin main
```
