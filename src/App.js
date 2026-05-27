import { useState, useEffect } from "react";

// ── 데이터 및 환경 설정 ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  attend: { label: "참석", bg: "#F0FDF4", color: "#166534", border: "#16A34A" },
  late:   { label: "지각", bg: "#FEF9C3", color: "#854D0E", border: "#CA8A04" },
  absent: { label: "불참", bg: "#FEE2E2", color: "#991B1B", border: "#DC2626" },
  pending:{ label: "미응답", bg: "#F5F5F4", color: "#78716C", border: "#E7E5E4" },
};

const MEETINGS = {
  campus: { id: "campus", title: "캠퍼스 채플", info: "매주 목요일 18:30 | 대강당" },
  district: { id: "district", title: "지구 채플", info: "매주 금요일 19:00 | 센터" }
};

const STORAGE_KEY = "ccc-gather-votes-v4";
const ADMIN_PASSWORD = "soon"; 

function loadVotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { campus: {}, district: {} };
  } catch {
    return { campus: {}, district: {} };
  }
}

function saveVotes(votes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {}
}

const THEME = {
  bg: "#FDFBF7",         
  cardBg: "#FFFFFF",     
  border: "#EFEBE3",     
  textMain: "#44403C",   
  textSub: "#78716C",    
  primary: "#D97706",    
};

// ── 공통 컴포넌트 ────────────────────────────────────────────────────────────

function Header({ title, sub, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              border: "none", background: "none", fontSize: 18, cursor: "pointer",
              color: THEME.textMain, padding: "4px 6px", borderRadius: 8,
            }}
          >
            ←
          </button>
        )}
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: THEME.textMain }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: THEME.textSub, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <div style={{ fontSize: 18 }}>✝️</div>
    </div>
  );
}

// ── 1단계: 이름 및 직분 입력 화면 ───────────────────────────────────────────────

function NameInputScreen({ onNext, onAdminClick }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("순원"); // 기본값 '순원'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("이름을 입력해주세요!");
    onNext(name.trim(), role);
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: 400, margin: "40px auto 0" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌾</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: THEME.textMain, letterSpacing: "-0.5px" }}>CCC SOON</div>
        <div style={{ fontSize: 13, color: THEME.textSub, marginTop: 6 }}>따뜻한 순 모임 출석 체크</div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: THEME.cardBg, padding: 24, borderRadius: 20, border: `1px solid ${THEME.border}`, boxShadow: "0 4px 20px rgba(68,64,60,0.03)" }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: THEME.textMain, marginBottom: 8 }}>이름을 입력해주세요</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${THEME.border}`,
            backgroundColor: "#FAF9F5", fontSize: 15, color: THEME.textMain, outline: "none",
            boxSizing: "border-box", marginBottom: 16
          }}
        />

        {/* [요청 반영] 순장 / 순원 선택 라디오 스타일 버튼 */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: THEME.textMain, marginBottom: 8 }}>직분을 선택해주세요</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["순원", "순장"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${role === r ? THEME.primary : THEME.border}`,
                background: role === r ? THEME.primary : "#FAF9F5",
                color: role === r ? "#FFF" : THEME.textMain,
                transition: "all 0.2s"
              }}
            >
              {r === "순장" ? "🌱 " : "🍃 "} {r}
            </button>
          ))}
        </div>

        <button 
          type="submit"
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: THEME.textMain, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer"
          }}
        >
          모임 투표하러 가기
        </button>
      </form>

      <button 
        onClick={onAdminClick}
        style={{
          width: "100%", marginTop: 24, padding: "12px", borderRadius: 12, border: `1px dashed ${THEME.border}`,
          background: "transparent", color: THEME.textSub, fontSize: 13, cursor: "pointer"
        }}
      >
        🔒 관리자 모아보기 (통합 현황)
      </button>
    </div>
  );
}

// ── 2&3단계 통합: 일정 바로 밑에 투표 기능이 붙어있는 모임 선택 화면 ──────────

function CombinedVoteScreen({ userName, userRole, votes, onVoteSubmitted, onGoHome, onBack }) {
  const [activeSelections, setActiveSelections] = useState({
    campus: votes.campus[userName]?.status || null,
    district: votes.district[userName]?.status || null
  });
  
  const [reasons, setReasons] = useState({
    campus: votes.campus[userName]?.reason || "",
    district: votes.district[userName]?.reason || ""
  });

  const [submittedMeetings, setSubmittedMeetings] = useState({
    campus: false,
    district: false
  });

  // 투표 버튼 클릭 이벤트
  const handleStatusSelect = (meetingId, status) => {
    setActiveSelections(prev => ({ ...prev, [meetingId]: status }));
    
    // '참석'은 사유가 없으므로 즉시 완료 처리
    if (status === "attend") {
      setSubmittedMeetings(prev => ({ ...prev, [meetingId]: true }));
      onVoteSubmitted(meetingId, status, "");
    }
  };

  // 지각/불참 사유 제출 이벤트
  const handleReasonSubmit = (e, meetingId) => {
    e.preventDefault();
    const currentStatus = activeSelections[meetingId];
    const currentReason = reasons[meetingId].trim();
    
    // [요청 반영] 불참일 때만 사유 필수체크, 지각일 때는 빈칸 허용
    if (currentStatus === "absent" && !currentReason) {
      return alert("불참 사유를 작성해 주세요!");
    }
    
    setSubmittedMeetings(prev => ({ ...prev, [meetingId]: true }));
    onVoteSubmitted(meetingId, currentStatus, currentReason);
  };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 420, margin: "0 auto" }}>
      <Header title="모임 선택 및 투표" sub={`${userName} ${userRole}님, 투표를 진행해 주세요.`} onBack={onBack} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
        {Object.values(MEETINGS).map(m => {
          const selectedStatus = activeSelections[m.id];
          const hasVotedThis = votes[m.id]?.[userName];

          // [요청 반영] 투표 완료 시 자동으로 튕기지 않고 화면 안에서 피드백 제공 후 홈 이동 버튼 활성화
          if (submittedMeetings[m.id]) {
            return (
              <div key={m.id} style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}`, padding: 24, borderRadius: 16, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: THEME.textMain }}>{m.title} 투표 완료!</div>
                <button
                  onClick={onGoHome}
                  style={{
                    marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "none",
                    background: THEME.primary, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  🏠 홈 화면으로 가기
                </button>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              style={{
                background: THEME.cardBg, border: `1px solid ${THEME.border}`, padding: 18,
                borderRadius: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.01)", display: "flex", flexDirection: "column"
              }}
            >
              {/* 상단 일정 타이틀 정보 */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: THEME.textMain, marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: THEME.textSub }}>{m.info}</div>
              </div>

              {/* 일정 바로 밑에 배치된 3단 투표 버튼 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: (selectedStatus === "late" || selectedStatus === "absent") ? 12 : 0 }}>
                {["attend", "late", "absent"].map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const isCurrent = selectedStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusSelect(m.id, s)}
                      style={{
                        padding: "10px 4px", borderRadius: 10, cursor: "pointer",
                        border: `2px solid ${isCurrent ? cfg.border : "transparent"}`,
                        background: isCurrent ? cfg.bg : "#F5F4F0",
                        color: cfg.color,
                        fontSize: 13, fontWeight: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        transition: "all 0.15s"
                      }}
                    >
                      <span style={{ fontSize: 16 }}>
                        {s === "attend" && "✅"}
                        {s === "late" && "⏰"}
                        {s === "absent" && "❌"}
                      </span>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* 지각/불참 시 사유 기입 칸 노출 */}
              {(selectedStatus === "late" || selectedStatus === "absent") && (
                <form onSubmit={(e) => handleReasonSubmit(e, m.id)} style={{ borderTop: `1px dashed ${THEME.border}`, paddingTop: 12, marginTop: 4 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: THEME.textMain, marginBottom: 4 }}>
                    {selectedStatus === "late" ? "⏰ 지각 사유 (선택사항)" : "❌ 불참 사유 (필수)"}
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input 
                      type="text"
                      value={reasons[m.id]}
                      onChange={(e) => setReasons(prev => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder={selectedStatus === "late" ? "사유 미적고 제출 가능" : "사유를 입력해 주세요"}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${THEME.border}`,
                        fontSize: 13, color: THEME.textMain, outline: "none", boxSizing: "border-box"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "0 14px", borderRadius: 8, border: "none",
                        background: THEME.textMain, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer"
                      }}
                    >
                      제출
                    </button>
                  </div>
                </form>
              )}

              {/* 기존 저장된 투표 내역 뱃지 알림 */}
              {hasVotedThis && !selectedStatus && (
                <div style={{ marginTop: 8, fontSize: 11, color: STATUS_CONFIG[hasVotedThis.status].color, fontWeight: 500 }}>
                  ✓ 현재 응답 완료 상태: [{STATUS_CONFIG[hasVotedThis.status].label}] {hasVotedThis.reason && `(${hasVotedThis.reason})`}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button
        onClick={onGoHome}
        style={{
          width: "100%", marginTop: 20, padding: "14px", borderRadius: 12, border: `1px solid ${THEME.border}`,
          background: "#FFF", color: THEME.textMain, fontWeight: 600, fontSize: 14, cursor: "pointer"
        }}
      >
        🏠 그냥 홈화면 가기
      </button>
    </div>
  );
}

// ── 관리자 비밀번호 입력 화면 ────────────────────────────────────────────────

function AdminAuthScreen({ onAuthSuccess, onBack }) {
  const [password, setPassword] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthSuccess();
    } else {
      alert("비밀번호가 틀렸습니다! (기본값: soon)");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: 400, margin: "60px auto 0" }}>
      <Header title="관리자 인증" sub="비밀번호를 입력해 주세요." onBack={onBack} />
      
      <form onSubmit={handleVerify} style={{ background: THEME.cardBg, padding: 24, borderRadius: 20, border: `1px solid ${THEME.border}` }}>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (soon)"
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${THEME.border}`,
            backgroundColor: "#FAF9F5", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 16
          }}
        />
        <button 
          type="submit"
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: THEME.textMain, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer"
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}

// ── 관리자: 통합 명단 및 퍼센트 바 확인 화면 ─────────────────────────────────

function AdminDashboardScreen({ votes, onReset, onBack }) {
  
  const getMeetingDetails = (typeVotes) => {
    const list = Object.entries(typeVotes).map(([name, data]) => ({
      name,
      role: data.role || "순원", // 기존 데이터 호환성 체크
      status: data.status,
      reason: data.reason || ""
    }));

    const attendList = list.filter(m => m.status === "attend");
    const lateList = list.filter(m => m.status === "late");
    const absentList = list.filter(m => m.status === "absent");
    const total = list.length;

    const attendPct = total > 0 ? Math.round((attendList.length / total) * 100) : 0;
    const latePct = total > 0 ? Math.round((lateList.length / total) * 100) : 0;
    const absentPct = total > 0 ? Math.round((absentList.length / total) * 100) : 0;

    // [요청 반영] 예상 출석률 계산: (참석 + 지각) / 전체 투표자
    const expectedAttendancePct = total > 0 
      ? Math.round(((attendList.length + lateList.length) / total) * 100) 
      : 0;

    return { attendList, lateList, absentList, total, attendPct, latePct, absentPct, expectedAttendancePct };
  };

  const campus = getMeetingDetails(votes.campus);
  const district = getMeetingDetails(votes.district);

  function MeetingSection({ title, data }) {
    return (
      <div style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 18, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: THEME.textMain }}>
            🏢 {title} <span style={{ fontSize: 11, color: THEME.primary, marginLeft: 4 }}>(총 {data.total}명 참여)</span>
          </div>
          {/* [요청 반영] 우측 상단에 노출되는 실시간 예상 출석률 디자인 */}
          {data.total > 0 && (
            <div style={{ background: "#EFF6FF", color: "#1E40AF", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "1px solid #BFDBFE" }}>
              📈 예상 출석률: {data.expectedAttendancePct}%
            </div>
          )}
        </div>

        {/* 퍼센티지 시각화 바 */}
        {data.total > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", background: "#EFEBE3", marginBottom: 6 }}>
              <div style={{ width: `${data.attendPct}%`, background: "#16A34A" }} />
              <div style={{ width: `${data.latePct}%`, background: "#CA8A04" }} />
              <div style={{ width: `${data.absentPct}%`, background: "#DC2626" }} />
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: "#166534" }}>참석 {data.attendPct}%</span>
              <span style={{ color: "#854D0E" }}>지각 {data.latePct}%</span>
              <span style={{ color: "#991B1B" }}>불참 {data.absentPct}%</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: THEME.textSub, textAlign: "center", padding: "10px 0" }}>투표 데이터가 없습니다.</div>
        )}

        {/* 상세 분리 명단 (직분 표기 포함) */}
        {data.total > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${THEME.border}`, paddingTop: 12 }}>
            {data.attendList.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 2 }}>• 참석자 명단 ({data.attendList.length}명)</div>
                <div style={{ fontSize: 13, color: THEME.textMain, paddingLeft: 4 }}>
                  {data.attendList.map(m => `${m.name}(${m.role})`).join(", ")}
                </div>
              </div>
            )}

            {data.lateList.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#854D0E", marginBottom: 2 }}>• 지각자 명단 ({data.lateList.length}명)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 4 }}>
                  {data.lateList.map(m => (
                    <div key={m.name} style={{ fontSize: 13, color: THEME.textMain }}>
                      <strong>{m.name}</strong> <span style={{ fontSize: 11, color: THEME.textSub }}>({m.role}) {m.reason ? `- 사유: ${m.reason}` : "(사유 미기재)"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.absentList.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>• 불참자 명단 ({data.absentList.length}명)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 4 }}>
                  {data.absentList.map(m => (
                    <div key={m.name} style={{ fontSize: 13, color: THEME.textMain }}>
                      <strong>{m.name}</strong> <span style={{ fontSize: 11, color: THEME.textSub }}>({m.role}) - 사유: {m.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Header title="📊 실시간 통합 현황판" sub="이름별 출석 상태 및 상세 사유" onBack={onBack} />
        <button 
          onClick={onReset}
          style={{
            padding: "5px 10px", borderRadius: 8, border: `1px solid ${THEME.border}`,
            background: "#FFF", color: "#EF4444", fontSize: 11, cursor: "pointer", fontWeight: 600
          }}
        >
          초기화
        </button>
      </div>

      <MeetingSection title="캠퍼스 채플 현황" data={campus} />
      <MeetingSection title="지구 채플 현황" data={district} />
    </div>
  );
}

// ── 메인 App 컴포넌트 ─────────────────────────────────────────────────────────

export default function App() {
  const [votes, setVotes] = useState(loadVotes);
  const [step, setStep] = useState("NAME_INPUT"); 
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("순원"); // 유저 직분 정보

  useEffect(() => {
    document.title = "KCCC SOON 출석투표";
  }, []);

  useEffect(() => {
    saveVotes(votes);
  }, [votes]);

  const handleVoteSubmitted = (meetingId, status, reason = "") => {
    setVotes(prev => ({
      ...prev,
      [meetingId]: {
        ...prev[meetingId],
        [userName]: { status, reason, role: userRole } // 직분 정보도 함께 투표 데이터에 저장
      }
    }));
  };

  const handleGoHome = () => {
    setStep("NAME_INPUT");
    setUserName("");
    setUserRole("순원");
  };

  const handleReset = () => {
    if (window.confirm("정말 모든 투표 데이터를 원격 초기화하시겠습니까?")) {
      const resetData = { campus: {}, district: {} };
      setVotes(resetData);
      saveVotes(resetData);
    }
  };

  return (
    <div style={{
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.textMain,
      maxWidth: "480px", 
      margin: "0 auto",  
      boxShadow: "0 0 20px rgba(0,0,0,0.05)" 
    }}>

      {step === "NAME_INPUT" && (
        <NameInputScreen 
          onNext={(name, role) => { 
            setUserName(name); 
            setUserRole(role);
            setStep("COMBINED_VOTE"); 
          }} 
          onAdminClick={() => setStep("ADMIN_AUTH")}
        />
      )}

      {step === "COMBINED_VOTE" && (
        <CombinedVoteScreen 
          userName={userName}
          userRole={userRole}
          votes={votes}
          onVoteSubmitted={handleVoteSubmitted}
          onGoHome={handleGoHome}
          onBack={handleGoHome}
        />
      )}

      {step === "ADMIN_AUTH" && (
        <AdminAuthScreen 
          onAuthSuccess={() => setStep("ADMIN_DASHBOARD")}
          onBack={handleGoHome}
        />
      )}

      {step === "ADMIN_DASHBOARD" && (
        <AdminDashboardScreen 
          votes={votes}
          onReset={handleReset}
          onBack={handleGoHome}
        />
      )}
    </div>
  );
}