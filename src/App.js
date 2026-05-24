import { useState, useEffect } from "react";

const MEMBERS = [
  { id: 1, name: "김지수", avatar: "지수", color: "#6D28D9" },
  { id: 2, name: "이민준", avatar: "민준", color: "#1D4ED8" },
  { id: 3, name: "박서연", avatar: "서연", color: "#065F46" },
  { id: 4, name: "최다은", avatar: "다은", color: "#B45309" },
  { id: 5, name: "정우진", avatar: "우진", color: "#BE185D" },
  { id: 6, name: "한소희", avatar: "소희", color: "#0369A1" },
];

const MEETINGS = [
  {
    id: 1,
    type: "금요 기도회",
    date: "2025년 5월 30일 (금)",
    time: "19:00",
    location: "본관 302호",
    open: true,
  },
  {
    id: 2,
    type: "화요 채플",
    date: "2025년 6월 3일 (화)",
    time: "12:00",
    location: "채플실",
    open: false,
  },
];

const STATUS_CONFIG = {
  attend: { label: "참석", bg: "#DCFCE7", color: "#15803D", border: "#16A34A" },
  late:   { label: "지각", bg: "#FEF9C3", color: "#92400E", border: "#CA8A04" },
  absent: { label: "불참", bg: "#FEE2E2", color: "#991B1B", border: "#DC2626" },
  pending:{ label: "미응답", bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB" },
};

const ICONS = {
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  bulb: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
};

function Avatar({ name, color, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 500, flexShrink: 0,
    }}>
      {name[0]}
    </div>
  );
}

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

function PhoneFrame({ label, accentColor, children }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{
        background: "#F9FAFB", borderRadius: 28, padding: 10,
        border: "0.5px solid #E5E7EB",
      }}>
        <div style={{
          background: "#111827", borderRadius: "18px 18px 0 0",
          height: 28, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#374151" }} />
        </div>
        <div style={{
          background: "#fff", borderRadius: "0 0 18px 18px",
          maxHeight: 580, overflowY: "auto", padding: "14px 12px",
          scrollbarWidth: "none",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MemberScreen({ votes, onVote }) {
  const meeting = MEETINGS[0];
  const next = MEETINGS[1];
  const myVote = votes["me"] || null;

  return (
    <>
      {/* Push 배너 */}
      <div style={{
        background: "#1C1C1E", borderRadius: 12, padding: "10px 12px",
        display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#4F46E5",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", flexShrink: 0,
        }}>
          {ICONS.bell}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>CCC 모임 · 방금 전</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", marginBottom: 2 }}>금요 기도회 공지</div>
          <div style={{ fontSize: 11, color: "#D1D5DB", lineHeight: 1.5 }}>
            이번 주 금요일 7시, 본관 302호에서 열립니다. 참석 여부를 알려주세요!
          </div>
        </div>
      </div>

      {/* 앱 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#4F46E5",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
        }}>
          {ICONS.users}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>CCC 모임</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>한빛 순 · 2025년 가을학기</div>
        </div>
      </div>

      {/* 모임 카드 */}
      <div style={{
        background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 14,
        padding: 14, marginBottom: 12,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 500, background: "#EDE9FE", color: "#5B21B6",
          padding: "3px 9px", borderRadius: 20, marginBottom: 8,
        }}>
          {ICONS.calendar} 이번 주 모임
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: 4 }}>{meeting.type}</div>
        <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#6B7280", marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{ICONS.clock} {meeting.date} {meeting.time}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{ICONS.pin} {meeting.location}</span>
        </div>

        <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>출석 여부를 선택해주세요</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {["attend", "late", "absent"].map(s => {
            const cfg = STATUS_CONFIG[s];
            const selected = myVote === s;
            return (
              <button
                key={s}
                onClick={() => onVote("me", s)}
                style={{
                  padding: "9px 4px", borderRadius: 9, cursor: "pointer",
                  border: `1.5px solid ${cfg.border}`,
                  background: selected ? cfg.border : cfg.bg,
                  color: selected ? "#fff" : cfg.color,
                  fontSize: 12, fontWeight: 500, display: "flex",
                  flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all 0.15s ease",
                }}
              >
                {s === "attend" && ICONS.check}
                {s === "late" && ICONS.clock}
                {s === "absent" && <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>}
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 다음 모임 */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.3 }}>예정된 모임</div>
      <div style={{
        background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 14,
        padding: 14, opacity: 0.65,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 500, background: "#DBEAFE", color: "#1E40AF",
          padding: "3px 9px", borderRadius: 20, marginBottom: 8,
        }}>
          {ICONS.calendar} 다음 주
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: 4 }}>{next.type}</div>
        <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{ICONS.clock} {next.date} {next.time}</span>
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>공지 예정 · 투표 미오픈</div>
      </div>
    </>
  );
}

function AdminScreen({ votes }) {
  const total = MEMBERS.length;
  const attendCount = MEMBERS.filter(m => votes[m.id] === "attend").length;
  const lateCount   = MEMBERS.filter(m => votes[m.id] === "late").length;
  const absentCount = MEMBERS.filter(m => votes[m.id] === "absent").length;
  const pending     = total - attendCount - lateCount - absentCount;
  const voted       = total - pending;
  const rate        = voted > 0 ? Math.round(((attendCount + lateCount * 0.7) / total) * 100) : 0;
  const snacks      = attendCount + lateCount;

  const Bar = ({ count, color, label }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
          <span style={{ color, fontWeight: 500 }}>{label} {count}명</span>
          <span>{pct}%</span>
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 4, height: 7, overflow: "hidden" }}>
          <div style={{ background: color, width: `${pct}%`, height: "100%", borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 앱 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#0F6E56",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
        }}>
          {ICONS.chart}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>한빛 순 관리자</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>금요 기도회 · 5월 30일</div>
        </div>
      </div>

      {/* 예상 참석률 카드 */}
      <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>예상 참석 현황</span>
          <span style={{ fontSize: 11, color: "#6B7280" }}>투표율 {Math.round((voted / total) * 100)}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 30, fontWeight: 500, color: "#16A34A" }}>{rate}%</span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>예상 참석률</span>
        </div>
        <Bar count={attendCount} color="#16A34A" label="참석" />
        <Bar count={lateCount}   color="#D97706" label="지각" />
        <Bar count={absentCount} color="#DC2626" label="불참" />
        <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "right", marginTop: 4 }}>
          ✦ 자동 집계됨
        </div>
      </div>

      {/* 자동 준비 안내 */}
      <div style={{
        background: "#F0FDF4", border: "0.5px solid #BBF7D0", borderRadius: 10,
        padding: "10px 12px", marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#15803D", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
          {ICONS.bulb} 자동 준비 안내
        </div>
        <div style={{ fontSize: 11, color: "#166534", lineHeight: 1.7 }}>
          예상 참석 <strong>{snacks}명</strong> 기준<br />
          음료 준비: <strong>{snacks}개</strong> · 간식: <strong>{Math.ceil(snacks / 6)}팩</strong><br />
          의자 배치: <strong>{snacks}석</strong> (예비 3석 권장)
        </div>
      </div>

      {/* 순원별 현황 */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.3 }}>순원별 응답 현황</div>
      <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 14, padding: "10px 12px" }}>
        {MEMBERS.map((m, i) => {
          const status = votes[m.id] || "pending";
          return (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
              borderBottom: i < MEMBERS.length - 1 ? "0.5px solid #F3F4F6" : "none",
            }}>
              <Avatar name={m.avatar} color={m.color} size={26} />
              <span style={{ flex: 1, fontSize: 12, color: "#111827" }}>{m.name}</span>
              <StatusPill status={status} />
            </div>
          );
        })}
      </div>

      {/* 통계 요약 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
        {[
          { num: attendCount, label: "참석", color: "#16A34A" },
          { num: lateCount,   label: "지각", color: "#D97706" },
          { num: absentCount, label: "불참", color: "#DC2626" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#F9FAFB", borderRadius: 10, padding: "10px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.num}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [votes, setVotes] = useState({
    "me": "attend",
    1: "attend",
    2: "late",
    3: "absent",
  });

  const handleVote = (id, status) => {
    setVotes(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", padding: "20px 16px", maxWidth: 720, margin: "0 auto" }}>
      {/* 상단 탭: 순원 투표 시뮬레이션 */}
      <div style={{
        background: "#F0F4FF", border: "0.5px solid #C7D2FE", borderRadius: 10,
        padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#3730A3",
      }}>
        <strong>순원 화면에서 투표 버튼을 눌러보세요</strong> — 관리자 화면 통계가 실시간으로 바뀝니다.
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {MEMBERS.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>{m.name}:</span>
              {["attend", "late", "absent"].map(s => (
                <button
                  key={s}
                  onClick={() => handleVote(m.id, s)}
                  style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${STATUS_CONFIG[s].border}`,
                    background: votes[m.id] === s ? STATUS_CONFIG[s].border : STATUS_CONFIG[s].bg,
                    color: votes[m.id] === s ? "#fff" : STATUS_CONFIG[s].color,
                    fontWeight: 500,
                  }}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PhoneFrame label="순원 화면" accentColor="#4F46E5">
          <MemberScreen votes={votes} onVote={handleVote} />
        </PhoneFrame>

        <PhoneFrame label="간사 관리자 화면" accentColor="#0F6E56">
          <AdminScreen votes={votes} />
        </PhoneFrame>
      </div>
    </div>
  );
}
