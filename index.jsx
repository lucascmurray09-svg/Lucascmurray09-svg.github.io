import { useState, useRef, useEffect } from "react";
import { Leaf, GraduationCap, Sparkles, PawPrint, ShieldCheck, Star, Clock, MapPin, MessageCircle, Check, X, Plus, ArrowLeft, Send, ChevronDown, LogOut, UserCircle2 } from "lucide-react";

/* ---------- design tokens ----------
Palette:
  --ink:      #1F3A34  (deep pine — headings, primary)
  --paper:    #FBFAF6  (warm paper background)
  --card:     #FFFFFF
  --line:     #E4E0D4  (hairline borders)
  --moss:     #6B8F71  (secondary green)
  --marigold: #E0A03D  (warm accent — CTAs, pins)
  --sky:      #4A6FA5  (status/info blue)
  --clay:     #C1613F  (pending/attention, used sparingly)
Type:
  Display: "Fraunces" (warm serif, restrained use — headings only)
  Body: "Inter"
  Utility/data: "IBM Plex Mono" (badges, stats, timestamps)
Signature element: listing cards styled like index cards pinned to a
neighborhood board — a small marigold "pin" dot, hand-set service tags
as chips, corner fold shadow.
------------------------------------ */

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap";

const SERVICE_TYPES = {
  yard: { label: "Yard work", icon: Leaf, color: "#6B8F71" },
  tutoring: { label: "Tutoring", icon: GraduationCap, color: "#4A6FA5" },
  carwash: { label: "Car washing", icon: Sparkles, color: "#E0A03D" },
  petcare: { label: "Pet care", icon: PawPrint, color: "#C1613F" },
};

const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const seedGuardians = [
  { id: "g1", name: "Dana Reyes", email: "dana@example.com", phone: "(555) 019-2231", password: "demo" },
];

const seedRequesters = [
  { id: "req1", name: "Alex Requester", email: "alex@example.com", phone: "(555) 000-0001", password: "demo" },
];

const seedTeens = [
  {
    id: "t1", guardianId: "g1", name: "Maya R.", age: 16, area: "Maple Heights",
    services: ["yard", "petcare"], rate: "$18/hr",
    bio: "I've mowed lawns and watered gardens around the neighborhood for two summers. Happy to do one-time jobs or a weekly schedule.",
    reviews: [
      { rating: 5, text: "Great with the yard and always on time.", author: "T. Nguyen" },
      { rating: 5, text: "Very reliable, watered our plants all week while we traveled.", author: "S. Patel" },
    ],
  },
  {
    id: "t2", guardianId: "g1", name: "Jordan K.", age: 17, area: "Maple Heights",
    services: ["tutoring"], rate: "$25/hr",
    bio: "Algebra 1-2 and Geometry tutoring. I explain things a couple different ways until it clicks.",
    reviews: [{ rating: 5, text: "My son's grades came up a full letter in a month.", author: "D. Ochoa" }],
  },
];

const seedRequests = [
  {
    id: "r1", teenId: "t1", requesterId: "req1", requesterName: "Alex Requester", requesterContact: "alex@example.com",
    serviceType: "yard", description: "Looking for someone to mow and edge a small backyard, roughly biweekly this summer.",
    preferredDate: "Flexible weekends", status: "pending", messages: [],
  },
];

function Avatar({ name, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(155deg, #1F3A34, #3E6459)", color: "#FBFAF6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: size * 0.36, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

function ServiceChip({ type }) {
  const s = SERVICE_TYPES[type];
  const Icon = s.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${s.color}1A`, color: s.color, border: `1px solid ${s.color}40`,
      padding: "3px 10px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
    }}>
      <Icon size={12.5} strokeWidth={2.4} />
      {s.label}
    </span>
  );
}

function Stars({ value }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} fill={i <= value ? "#E0A03D" : "none"} color="#E0A03D" strokeWidth={1.6} />
      ))}
    </span>
  );
}

function avgRating(reviews) {
  if (!reviews.length) return null;
  return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
}

function Card({ children, style }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E4E0D4", borderRadius: 14,
      boxShadow: "0 1px 2px rgba(31,58,52,0.04), 0 8px 20px -12px rgba(31,58,52,0.10)",
      position: "relative", ...style,
    }}>
      {children}
    </div>
  );
}

function PinDot() {
  return (
    <div style={{
      position: "absolute", top: -6, left: 22, width: 12, height: 12, borderRadius: "50%",
      background: "#E0A03D", boxShadow: "0 2px 3px rgba(0,0,0,0.18)", border: "2px solid #FBFAF6",
    }} />
  );
}

function Badge({ children, tone = "moss" }) {
  const tones = {
    moss: { bg: "#6B8F711A", fg: "#4E6B53" },
    sky: { bg: "#4A6FA51A", fg: "#3A5A87" },
    clay: { bg: "#C1613F1A", fg: "#A64F31" },
    ink: { bg: "#1F3A341A", fg: "#1F3A34" },
  };
  const t = tones[tone];
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: 0.2,
      background: t.bg, color: t.fg, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", style, disabled, type = "button" }) {
  const variants = {
    primary: { background: "#1F3A34", color: "#FBFAF6", border: "1px solid #1F3A34" },
    ghost: { background: "transparent", color: "#1F3A34", border: "1px solid #D8D3C4" },
    accent: { background: "#E0A03D", color: "#241505", border: "1px solid #E0A03D" },
    danger: { background: "transparent", color: "#A64F31", border: "1px solid #C1613F55" },
  };
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{
        ...variants[variant], fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
        padding: "9px 16px", borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6,
        transition: "transform 0.12s ease, opacity 0.12s ease", ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#5B6560", marginBottom: 5 }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14, padding: "9px 11px",
  border: "1px solid #D8D3C4", borderRadius: 8, background: "#FBFAF6", color: "#1F3A34",
  outline: "none", boxSizing: "border-box",
};

function TeenCard({ teen, onOpen }) {
  const rating = avgRating(teen.reviews);
  return (
    <Card style={{ padding: 18 }}>
      <PinDot />
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Avatar name={teen.name} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "#1F3A34" }}>
            {teen.name}, {teen.age}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#6B7570", marginTop: 2 }}>
            <MapPin size={12} /> {teen.area}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {teen.services.map((s) => <ServiceChip key={s} type={s} />)}
      </div>
      <p style={{ fontSize: 13.5, color: "#454F4A", lineHeight: 1.5, marginBottom: 14 }}>{teen.bio}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#1F3A34", fontWeight: 500 }}>{teen.rate}</div>
        {rating ? (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Stars value={Math.round(rating)} /><span style={{ fontSize: 12, color: "#6B7570" }}>{rating} ({teen.reviews.length})</span>
          </div>
        ) : <span style={{ fontSize: 12, color: "#9A9284" }}>New listing</span>}
      </div>
      {onOpen && (
        <Button variant="primary" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => onOpen(teen)}>
          View profile & request
        </Button>
      )}
    </Card>
  );
}

function SafetyNotice({ compact }) {
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      background: "#1F3A340D", border: "1px solid #1F3A3422", borderRadius: 10,
      padding: compact ? "9px 12px" : "12px 14px", fontSize: 12.5, color: "#3E4A45", lineHeight: 1.5,
    }}>
      <ShieldCheck size={16} color="#1F3A34" style={{ flexShrink: 0, marginTop: 1 }} />
      <span>Every request is reviewed by the teen's parent or guardian before any contact happens. You'll message the guardian directly — never the teen alone.</span>
    </div>
  );
}

function TeenProfileModal({ teen, onClose, onRequest, currentRequester, requesters, onRequesterLogin, onRequesterSignup }) {
  const [form, setForm] = useState({ serviceType: teen.services[0], description: "", preferredDate: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onRequest({
      teenId: teen.id,
      requesterId: currentRequester.id,
      requesterName: currentRequester.name,
      requesterContact: currentRequester.email,
      ...form,
    });
    setSent(true);
  };
  const rating = avgRating(teen.reviews);

  // Profile section shown at top regardless of auth state
  const ProfileHeader = () => (
    <>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7570", fontSize: 13, cursor: "pointer", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <Avatar name={teen.name} size={56} />
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, color: "#1F3A34" }}>{teen.name}, {teen.age}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7570" }}><MapPin size={12} />{teen.area}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {teen.services.map((s) => <ServiceChip key={s} type={s} />)}
      </div>
      <p style={{ fontSize: 14, color: "#3E4A45", lineHeight: 1.6, marginBottom: 16 }}>{teen.bio}</p>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1F3A34", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>Reviews {rating && `· ${rating} avg`}</div>
        {teen.reviews.length === 0 && <div style={{ fontSize: 13, color: "#9A9284" }}>No reviews yet.</div>}
        {teen.reviews.map((r, i) => (
          <div key={i} style={{ borderTop: "1px solid #E4E0D4", padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <Stars value={r.rating} />
              <span style={{ fontSize: 11.5, color: "#9A9284" }}>{r.author}</span>
            </div>
            <div style={{ fontSize: 13, color: "#454F4A" }}>{r.text}</div>
          </div>
        ))}
      </div>
      <SafetyNotice />
    </>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,58,52,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }} onClick={onClose}>
      <div style={{ background: "#FBFAF6", borderRadius: 16, maxWidth: 520, width: "100%", maxHeight: "88vh", overflowY: "auto", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#6B8F711A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={26} color="#4E6B53" />
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: "#1F3A34", marginBottom: 8 }}>Request sent to the guardian</div>
            <p style={{ fontSize: 13.5, color: "#5B6560", lineHeight: 1.6, marginBottom: 18 }}>
              {teen.name.split(" ")[0]}'s parent will review your request and either approve it or reach out with questions. You'll see the status update under "My requests."
            </p>
            <Button variant="primary" onClick={onClose}>Done</Button>
          </div>
        ) : !currentRequester ? (
          <>
            <ProfileHeader />
            <div style={{ marginTop: 20, borderTop: "1px solid #E4E0D4", paddingTop: 20 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "#1F3A34", marginBottom: 6 }}>Sign in to send a request</div>
              <p style={{ fontSize: 13, color: "#6B7570", marginBottom: 16 }}>You need a free account to contact this teen's guardian. It only takes a moment.</p>
              <RequesterAuthGate
                requesters={requesters}
                onLogin={onRequesterLogin}
                onSignup={onRequesterSignup}
                compact
              />
            </div>
          </>
        ) : (
          <>
            <ProfileHeader />
            <form onSubmit={submit} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: "#1F3A34" }}>Request this service</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#6B8F711A", border: "1px solid #6B8F7140", borderRadius: 8, padding: "4px 10px" }}>
                  <Avatar name={currentRequester.name} size={20} />
                  <span style={{ fontSize: 12, color: "#4E6B53", fontWeight: 600 }}>{currentRequester.name}</span>
                </div>
              </div>
              <Field label="Service">
                <select style={inputStyle} value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                  {teen.services.map((s) => <option key={s} value={s}>{SERVICE_TYPES[s].label}</option>)}
                </select>
              </Field>
              <Field label="What do you need done?">
                <textarea required style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A quick description of the job" />
              </Field>
              <Field label="Preferred timing">
                <input style={inputStyle} value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} placeholder="e.g. weekday afternoons" />
              </Field>
              <Button type="submit" variant="accent" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>Send request to guardian</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function MessageThread({ request, teen, onSend, senderRole }) {
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    onSend(request.id, senderRole, text.trim());
    setText("");
  };
  return (
    <div style={{ border: "1px solid #E4E0D4", borderRadius: 12, background: "#FFFFFF", display: "flex", flexDirection: "column", height: 320 }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #E4E0D4", fontSize: 12.5, fontWeight: 600, color: "#1F3A34", display: "flex", alignItems: "center", gap: 6 }}>
        <ShieldCheck size={14} color="#6B8F71" /> Guardian-mediated thread · re: {teen.name.split(" ")[0]}'s {SERVICE_TYPES[request.serviceType].label.toLowerCase()}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {request.messages.length === 0 && <div style={{ fontSize: 12.5, color: "#9A9284" }}>No messages yet — say hello and confirm the details.</div>}
        {request.messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.sender === "guardian" ? "flex-start" : "flex-end", maxWidth: "78%" }}>
            <div style={{
              background: m.sender === "guardian" ? "#1F3A340D" : "#4A6FA51A",
              color: "#2B332F", padding: "8px 11px", borderRadius: 10, fontSize: 13, lineHeight: 1.45,
            }}>
              {m.text}
            </div>
            <div style={{ fontSize: 10.5, color: "#9A9284", marginTop: 2, textAlign: m.sender === "guardian" ? "left" : "right" }}>
              {m.sender === "guardian" ? "Guardian" : "You"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid #E4E0D4" }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button variant="primary" onClick={send}><Send size={14} /></Button>
      </div>
    </div>
  );
}

function AddTeenForm({ guardianId, onAdd, onCancel }) {
  const [form, setForm] = useState({ name: "", age: "", area: "", rate: "", bio: "", services: [] });
  const toggleService = (s) => setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.services.length) return;
    onAdd({ ...form, id: "t" + Date.now(), guardianId, age: Number(form.age), reviews: [] });
  };
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "#1F3A34", marginBottom: 14 }}>Add a teen profile</div>
      <SafetyNotice compact />
      <form onSubmit={submit} style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="First name + last initial"><input required style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sam T." /></Field>
          <Field label="Age"><input required type="number" min={13} max={18} style={inputStyle} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Field>
        </div>
        <Field label="General area (neighborhood, not address)"><input required style={inputStyle} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Maple Heights" /></Field>
        <Field label="Rate"><input required style={inputStyle} value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} placeholder="e.g. $20/hr" /></Field>
        <Field label="Services offered">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(SERVICE_TYPES).map(([key, s]) => (
              <button type="button" key={key} onClick={() => toggleService(key)} style={{
                border: form.services.includes(key) ? `1px solid ${s.color}` : "1px solid #D8D3C4",
                background: form.services.includes(key) ? `${s.color}1A` : "transparent",
                color: form.services.includes(key) ? s.color : "#5B6560",
                borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <s.icon size={12.5} /> {s.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Bio"><textarea required style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A couple sentences about experience and availability" /></Field>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Button variant="primary" type="submit">Create profile</Button>
          <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

/* ---------- Requester account ---------- */

function RequesterAuthGate({ requesters, onLogin, onSignup, compact = false }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (mode === "login") {
      const match = requesters.find((r) => r.email.toLowerCase() === email && r.password === form.password);
      if (!match) { setError("No account matches that email and password."); return; }
      setSubmitting(true);
      await onLogin(match.id);
      setSubmitting(false);
    } else {
      if (requesters.some((r) => r.email.toLowerCase() === email)) { setError("An account already exists with that email."); return; }
      if (!form.name || !email || !form.password) { setError("Fill in all fields."); return; }
      setSubmitting(true);
      await onSignup({ id: "req" + Date.now(), name: form.name, email, phone: form.phone, password: form.password });
      setSubmitting(false);
    }
  };

  const wrap = compact ? {} : { padding: 24, maxWidth: 400, margin: "20px auto" };

  return (
    <Card style={wrap}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "#1F3A340D", padding: 4, borderRadius: 999 }}>
        {[["login", "Log in"], ["signup", "Create account"]].map(([k, label]) => (
          <button key={k} type="button" onClick={() => { setMode(k); setError(""); }} style={{
            flex: 1, border: "none", background: mode === k ? "#1F3A34" : "transparent", color: mode === k ? "#FBFAF6" : "#1F3A34",
            padding: "7px 10px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>
      {!compact && (
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: "#1F3A34", marginBottom: 4 }}>
          {mode === "login" ? "Welcome back" : "Create a free account"}
        </div>
      )}
      <form onSubmit={submit}>
        {mode === "signup" && (
          <Field label="Your full name"><input required style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></Field>
        )}
        <Field label="Email"><input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field>
        {mode === "signup" && (
          <Field label="Phone (optional)"><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-5555" /></Field>
        )}
        <Field label="Password"><input required type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></Field>
        {error && <div style={{ fontSize: 12.5, color: "#A64F31", marginBottom: 12 }}>{error}</div>}
        <Button type="submit" variant="primary" style={{ width: "100%", justifyContent: "center" }} disabled={submitting}>
          {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
      {mode === "login" && (
        <div style={{ fontSize: 11.5, color: "#9A9284", marginTop: 12, textAlign: "center" }}>
          Demo account: alex@example.com / demo
        </div>
      )}
    </Card>
  );
}

/* ---------- Guardian account management ---------- */

function GuardianAuthGate({ guardians, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (mode === "login") {
      const match = guardians.find((g) => g.email.toLowerCase() === email && g.password === form.password);
      if (!match) { setError("No account matches that email and password."); return; }
      setSubmitting(true);
      await onLogin(match.id);
      setSubmitting(false);
    } else {
      if (guardians.some((g) => g.email.toLowerCase() === email)) { setError("An account already exists with that email."); return; }
      if (!form.name || !email || !form.password) { setError("Fill in all fields."); return; }
      setSubmitting(true);
      await onSignup({ id: "g" + Date.now(), name: form.name, email, phone: form.phone, password: form.password });
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ padding: 24, maxWidth: 400, margin: "20px auto" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "#1F3A340D", padding: 4, borderRadius: 999 }}>
        {[["login", "Log in"], ["signup", "Create account"]].map(([k, label]) => (
          <button key={k} type="button" onClick={() => { setMode(k); setError(""); }} style={{
            flex: 1, border: "none", background: mode === k ? "#1F3A34" : "transparent", color: mode === k ? "#FBFAF6" : "#1F3A34",
            padding: "7px 10px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: "#1F3A34", marginBottom: 4 }}>
        {mode === "login" ? "Welcome back" : "Set up your guardian account"}
      </div>
      <p style={{ fontSize: 12.5, color: "#6B7570", marginBottom: 16 }}>
        {mode === "login" ? "Log in to manage your teen's listing and requests." : "You'll use this account to create your teen's profile and approve every request before contact happens."}
      </p>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <Field label="Your full name"><input required style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Parent / guardian name" /></Field>
        )}
        <Field label="Email"><input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field>
        {mode === "signup" && (
          <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-5555" /></Field>
        )}
        <Field label="Password"><input required type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></Field>
        {error && <div style={{ fontSize: 12.5, color: "#A64F31", marginBottom: 12 }}>{error}</div>}
        <Button type="submit" variant="primary" style={{ width: "100%", justifyContent: "center" }} disabled={submitting}>
          {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
      {mode === "login" && (
        <div style={{ fontSize: 11.5, color: "#9A9284", marginTop: 14, textAlign: "center" }}>
          Demo account: dana@example.com / demo
        </div>
      )}
    </Card>
  );
}

function AccountTab({ guardian, onUpdate, onLogout }) {
  const [form, setForm] = useState({ name: guardian.name, email: guardian.email, phone: guardian.phone });
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onUpdate({ ...guardian, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Card style={{ padding: 20, maxWidth: 440 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <Avatar name={guardian.name} size={48} />
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "#1F3A34" }}>{guardian.name}</div>
          <div style={{ fontSize: 12.5, color: "#6B7570" }}>Guardian account</div>
        </div>
      </div>
      <form onSubmit={submit}>
        <Field label="Full name"><input required style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email"><input required type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <Button type="submit" variant="primary">Save changes</Button>
          {saved && <span style={{ fontSize: 12.5, color: "#4E6B53", fontWeight: 600 }}>Saved</span>}
        </div>
      </form>
      <div style={{ borderTop: "1px solid #E4E0D4", marginTop: 18, paddingTop: 14 }}>
        <Button variant="ghost" onClick={onLogout}><LogOut size={14} /> Log out</Button>
      </div>
    </Card>
  );
}

function GuardianView({ guardian, teens, requests, onDecide, onAdd, onSend, onUpdateGuardian, onLogout }) {
  const [tab, setTab] = useState("requests");
  const [adding, setAdding] = useState(false);
  const myTeens = teens.filter((t) => t.guardianId === guardian.id);
  const myRequests = requests.filter((r) => myTeens.some((t) => t.id === r.teenId));
  const pending = myRequests.filter((r) => r.status === "pending");
  const approved = myRequests.filter((r) => r.status === "approved");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["requests", `Requests${pending.length ? ` (${pending.length})` : ""}`], ["teens", "My teens"], ["messages", "Messages"], ["account", "Account"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab === k ? "#1F3A34" : "transparent", color: tab === k ? "#FBFAF6" : "#1F3A34",
            border: "1px solid #1F3A34", padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {tab === "requests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myRequests.length === 0 && <div style={{ color: "#9A9284", fontSize: 13.5 }}>No requests yet.</div>}
          {myRequests.map((r) => {
            const teen = teens.find((t) => t.id === r.teenId);
            return (
              <Card key={r.id} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1F3A34" }}>{r.requesterName} → {teen.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7570" }}>{r.requesterContact} · wants {SERVICE_TYPES[r.serviceType].label.toLowerCase()}</div>
                  </div>
                  <Badge tone={r.status === "pending" ? "clay" : r.status === "approved" ? "moss" : "ink"}>{r.status}</Badge>
                </div>
                <p style={{ fontSize: 13.5, color: "#454F4A", marginBottom: 6 }}>{r.description}</p>
                <div style={{ fontSize: 12, color: "#6B7570", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} /> {r.preferredDate || "No timing specified"}</div>
                {r.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="primary" onClick={() => onDecide(r.id, "approved")}><Check size={14} /> Approve & start thread</Button>
                    <Button variant="danger" onClick={() => onDecide(r.id, "declined")}><X size={14} /> Decline</Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "teens" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
            {myTeens.map((t) => <TeenCard key={t.id} teen={t} />)}
          </div>
          {myTeens.length === 0 && !adding && <div style={{ color: "#9A9284", fontSize: 13.5, marginBottom: 16 }}>No teen profiles yet.</div>}
          {adding ? (
            <AddTeenForm guardianId={guardian.id} onAdd={(t) => { onAdd(t); setAdding(false); }} onCancel={() => setAdding(false)} />
          ) : (
            <Button variant="ghost" onClick={() => setAdding(true)}><Plus size={14} /> Add a teen profile</Button>
          )}
        </div>
      )}

      {tab === "messages" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {approved.length === 0 && <div style={{ color: "#9A9284", fontSize: 13.5 }}>No active conversations yet — approve a request to start one.</div>}
          {approved.map((r) => {
            const teen = teens.find((t) => t.id === r.teenId);
            return (
              <div key={r.id}>
                <div style={{ fontSize: 12.5, color: "#6B7570", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><MessageCircle size={13} /> with {r.requesterName}</div>
                <MessageThread request={r} teen={teen} onSend={onSend} senderRole="guardian" />
              </div>
            );
          })}
        </div>
      )}

      {tab === "account" && (
        <AccountTab guardian={guardian} onUpdate={onUpdateGuardian} onLogout={onLogout} />
      )}
    </div>
  );
}

function RequesterView({ teens, requests, onRequest, onSend, currentRequester, requesters, onRequesterLogin, onRequesterSignup, onRequesterLogout }) {
  const [tab, setTab] = useState("browse");
  const [filter, setFilter] = useState("all");
  const [openTeen, setOpenTeen] = useState(null);
  const myRequests = currentRequester ? requests.filter((r) => r.requesterId === currentRequester.id) : [];
  const visible = filter === "all" ? teens : teens.filter((t) => t.services.includes(filter));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          ["browse", "Browse"],
          ["mine", `My requests${myRequests.length ? ` (${myRequests.length})` : ""}`],
          ["account", currentRequester ? `Account (${currentRequester.name.split(" ")[0]})` : "Sign in"],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab === k ? "#1F3A34" : "transparent", color: tab === k ? "#FBFAF6" : "#1F3A34",
            border: "1px solid #1F3A34", padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {tab === "browse" && (
        <>
          <SafetyNotice />
          <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
            <button onClick={() => setFilter("all")} style={{
              border: filter === "all" ? "1px solid #1F3A34" : "1px solid #D8D3C4",
              background: filter === "all" ? "#1F3A34" : "transparent", color: filter === "all" ? "#FBFAF6" : "#5B6560",
              borderRadius: 999, padding: "6px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}>All services</button>
            {Object.entries(SERVICE_TYPES).map(([key, s]) => (
              <button key={key} onClick={() => setFilter(key)} style={{
                border: filter === key ? `1px solid ${s.color}` : "1px solid #D8D3C4",
                background: filter === key ? `${s.color}1A` : "transparent", color: filter === key ? s.color : "#5B6560",
                borderRadius: 999, padding: "6px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}><s.icon size={12} /> {s.label}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
            {visible.map((t) => <TeenCard key={t.id} teen={t} onOpen={setOpenTeen} />)}
          </div>
          {openTeen && (
            <TeenProfileModal
              teen={openTeen}
              onClose={() => setOpenTeen(null)}
              onRequest={onRequest}
              currentRequester={currentRequester}
              requesters={requesters}
              onRequesterLogin={onRequesterLogin}
              onRequesterSignup={onRequesterSignup}
            />
          )}
        </>
      )}

      {tab === "mine" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!currentRequester ? (
            <div style={{ color: "#9A9284", fontSize: 13.5 }}>Sign in to see your requests.</div>
          ) : myRequests.length === 0 ? (
            <div style={{ color: "#9A9284", fontSize: 13.5 }}>You haven't sent any requests yet.</div>
          ) : myRequests.map((r) => {
            const teen = teens.find((t) => t.id === r.teenId);
            return (
              <Card key={r.id} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1F3A34" }}>{teen.name} — {SERVICE_TYPES[r.serviceType].label}</div>
                  <Badge tone={r.status === "pending" ? "clay" : r.status === "approved" ? "moss" : "ink"}>{r.status}</Badge>
                </div>
                {r.status === "pending" && <div style={{ fontSize: 13, color: "#6B7570" }}>Waiting on {teen.name.split(" ")[0]}'s guardian to review this request.</div>}
                {r.status === "declined" && <div style={{ fontSize: 13, color: "#6B7570" }}>This request was declined.</div>}
                {r.status === "approved" && <div style={{ marginTop: 10 }}><MessageThread request={r} teen={teen} onSend={onSend} senderRole="requester" /></div>}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "account" && (
        currentRequester ? (
          <Card style={{ padding: 20, maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <Avatar name={currentRequester.name} size={48} />
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "#1F3A34" }}>{currentRequester.name}</div>
                <div style={{ fontSize: 12.5, color: "#6B7570" }}>{currentRequester.email}</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #E4E0D4", paddingTop: 14 }}>
              <Button variant="ghost" onClick={onRequesterLogout}><LogOut size={14} /> Log out</Button>
            </div>
          </Card>
        ) : (
          <RequesterAuthGate requesters={requesters} onLogin={onRequesterLogin} onSignup={onRequesterSignup} />
        )
      )}
    </div>
  );
}

/* ---------- Options dropdown (replaces the segmented slider) ---------- */

function RoleOptionsMenu({ role, onChange, guardianLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { key: "requester", label: "I need help", sub: "Browse & request services" },
    { key: "guardian", label: "I'm a guardian", sub: guardianLabel || "Manage listings & requests" },
  ];
  const current = options.find((o) => o.key === role);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button onClick={() => setOpen((v) => !v)} style={{
        display: "flex", alignItems: "center", gap: 8, background: "#1F3A34", color: "#FBFAF6",
        border: "1px solid #1F3A34", padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>
        <UserCircle2 size={15} />
        {current.label}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#FFFFFF",
          border: "1px solid #E4E0D4", borderRadius: 12, boxShadow: "0 10px 28px -10px rgba(31,58,52,0.25)",
          minWidth: 230, overflow: "hidden", zIndex: 40,
        }}>
          {options.map((o) => (
            <button key={o.key} onClick={() => { onChange(o.key); setOpen(false); }} style={{
              width: "100%", textAlign: "left", padding: "11px 14px", background: role === o.key ? "#1F3A340D" : "transparent",
              border: "none", borderBottom: "1px solid #E4E0D4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F3A34" }}>{o.label}</div>
                <div style={{ fontSize: 11.5, color: "#6B7570" }}>{o.sub}</div>
              </div>
              {role === o.key && <Check size={15} color="#4E6B53" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- persistence ---------- */
// Listings, guardian accounts, and requests are SHARED storage: anyone who opens
// this artifact reads and writes the same data, like a real site would. Only the
// "which guardian am I logged in as" session flag is kept personal to this browser.

async function loadKey(key, shared, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function saveKey(key, shared, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('${FONTS_LINK}'); @keyframes pulse { 0%,100% { opacity: 0.35 } 50% { opacity: 1 } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6B7570", fontSize: 13.5 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0A03D", animation: "pulse 1.1s ease-in-out infinite" }} />
        Loading Corner Board…
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [role, setRole] = useState("requester");
  const [teens, setTeensState] = useState(seedTeens);
  const [requests, setRequestsState] = useState(seedRequests);
  const [guardians, setGuardiansState] = useState(seedGuardians);
  const [requesters, setRequestersState] = useState(seedRequesters);
  const [currentGuardianId, setCurrentGuardianIdState] = useState(null);
  const [currentRequesterId, setCurrentRequesterIdState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, t, r, req, s] = await Promise.all([
        loadKey("guardians", true, seedGuardians),
        loadKey("teens", true, seedTeens),
        loadKey("requests", true, seedRequests),
        loadKey("requesters", true, seedRequesters),
        loadKey("session", false, { currentGuardianId: null, currentRequesterId: null }),
      ]);
      if (cancelled) return;
      setGuardiansState(g);
      setTeensState(t);
      setRequestsState(r);
      setRequestersState(req);
      // Only trust a stored session if that account still exists.
      setCurrentGuardianIdState(g.some((gu) => gu.id === s?.currentGuardianId) ? s.currentGuardianId : null);
      setCurrentRequesterIdState(req.some((rq) => rq.id === s?.currentRequesterId) ? s.currentRequesterId : null);
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const currentGuardian = guardians.find((g) => g.id === currentGuardianId);
  const currentRequester = requesters.find((r) => r.id === currentRequesterId);

  const updateTeens = (updater) => {
    setTeensState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveKey("teens", true, next).then((ok) => !ok && setSyncError(true));
      return next;
    });
  };
  const updateRequests = (updater) => {
    setRequestsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveKey("requests", true, next).then((ok) => !ok && setSyncError(true));
      return next;
    });
  };

  // Guardian signup/login write straight to storage and only flip local state
  // once the write is confirmed, so "create account" never leaves you stuck
  // on the auth screen if the save silently failed.
  const persistGuardians = async (next) => {
    setGuardiansState(next);
    const ok = await saveKey("guardians", true, next);
    if (!ok) setSyncError(true);
    return ok;
  };
  const persistSession = async (guardianId, requesterId) => {
    // Pass undefined to leave the other role's session unchanged
    const nextGuardianId = guardianId === undefined ? currentGuardianId : guardianId;
    const nextRequesterId = requesterId === undefined ? currentRequesterId : requesterId;
    setCurrentGuardianIdState(nextGuardianId);
    setCurrentRequesterIdState(nextRequesterId);
    const ok = await saveKey("session", false, { currentGuardianId: nextGuardianId, currentRequesterId: nextRequesterId });
    if (!ok) setSyncError(true);
    return ok;
  };

  const persistRequesters = async (next) => {
    setRequestersState(next);
    const ok = await saveKey("requesters", true, next);
    if (!ok) setSyncError(true);
    return ok;
  };

  const handleRequest = (form) => {
    updateRequests((rs) => [...rs, { ...form, id: "r" + Date.now(), status: "pending", messages: [] }]);
  };
  const handleDecide = (id, status) => updateRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  const handleAddTeen = (teen) => updateTeens((ts) => [...ts, teen]);
  const handleSend = (requestId, sender, text) => {
    updateRequests((rs) => rs.map((r) => (r.id === requestId ? { ...r, messages: [...r.messages, { sender, text, time: Date.now() }] } : r)));
  };
  const handleUpdateGuardian = (updated) => persistGuardians(guardians.map((g) => (g.id === updated.id ? updated : g)));
  const handleSignup = async (g) => {
    const next = [...guardians, g];
    await persistGuardians(next);
    await persistSession(g.id, undefined);
  };
  const handleLogin = async (id) => {
    await persistSession(id, undefined);
  };
  const handleLogout = () => persistSession(null, undefined);

  const handleRequesterSignup = async (r) => {
    const next = [...requesters, r];
    await persistRequesters(next);
    await persistSession(undefined, r.id);
  };
  const handleRequesterLogin = async (id) => {
    await persistSession(undefined, id);
  };
  const handleRequesterLogout = () => persistSession(undefined, null);

  const resetDemoData = async () => {
    await Promise.all([
      saveKey("guardians", true, seedGuardians),
      saveKey("requesters", true, seedRequesters),
      saveKey("teens", true, seedTeens),
      saveKey("requests", true, seedRequests),
      saveKey("session", false, { currentGuardianId: null, currentRequesterId: null }),
    ]);
    setGuardiansState(seedGuardians);
    setRequestersState(seedRequesters);
    setTeensState(seedTeens);
    setRequestsState(seedRequests);
    setCurrentGuardianIdState(null);
    setCurrentRequesterIdState(null);
  };

  if (!loaded) return <LoadingScreen />;

  return (
    <div style={{ minHeight: "100%", background: "#FBFAF6", fontFamily: "'Inter', sans-serif", color: "#1F3A34" }}>
      <style>{`@import url('${FONTS_LINK}'); * { box-sizing: border-box; } ::placeholder { color: #ADA791; } select { appearance: none; }`}</style>

      <div style={{ borderBottom: "1px solid #E4E0D4", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#1F3A34", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={18} color="#E0A03D" />
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, letterSpacing: -0.3 }}>Corner&nbsp;Board</div>
        </div>
        <RoleOptionsMenu
          role={role}
          onChange={setRole}
          guardianLabel={currentGuardian ? `Signed in as ${currentGuardian.name.split(" ")[0]}` : "Log in or create an account"}
        />
      </div>

      {syncError && (
        <div style={{ background: "#C1613F14", borderBottom: "1px solid #C1613F33", color: "#A64F31", fontSize: 12.5, padding: "8px 24px", textAlign: "center" }}>
          Changes aren't saving to shared storage right now — you can keep going, but they may not persist after this session.
        </div>
      )}

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 24px 60px" }}>
        <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, marginBottom: 4 }}>
              {role === "requester" ? "Neighborhood help, done right" : "Guardian dashboard"}
            </div>
            <div style={{ fontSize: 14, color: "#6B7570" }}>
              {role === "requester" ? "Browse teens offering yard work, tutoring, car washing and more nearby." : "Manage listings, review requests, and message approved requesters."}
            </div>
          </div>
          <button onClick={resetDemoData} style={{ background: "none", border: "none", color: "#9A9284", fontSize: 11.5, cursor: "pointer", textDecoration: "underline" }}>
            Reset demo data
          </button>
        </div>

        {role === "requester" ? (
          <RequesterView
            teens={teens}
            requests={requests}
            onRequest={handleRequest}
            onSend={handleSend}
            currentRequester={currentRequester}
            requesters={requesters}
            onRequesterLogin={handleRequesterLogin}
            onRequesterSignup={handleRequesterSignup}
            onRequesterLogout={handleRequesterLogout}
          />
        ) : currentGuardian ? (
          <GuardianView
            guardian={currentGuardian}
            teens={teens}
            requests={requests}
            onDecide={handleDecide}
            onAdd={handleAddTeen}
            onSend={handleSend}
            onUpdateGuardian={handleUpdateGuardian}
            onLogout={handleLogout}
          />
        ) : (
          <GuardianAuthGate guardians={guardians} onLogin={handleLogin} onSignup={handleSignup} />
        )}
      </div>
    </div>
  );
}
