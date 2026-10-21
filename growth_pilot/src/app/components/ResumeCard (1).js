export default function ResumeCard({
  name = "Jordan Ahmed",
  role = "Product Designer",
  status = "Draft",
  lastEdited = "Edited 2 days ago",
  onEdit,
  onDownload,
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rc-card">
      <div className="rc-preview">
        <span className="rc-pv-avatar" />
        <span className="rc-pv-line" style={{ width: "62%" }} />
        <span className="rc-pv-line accent" style={{ width: "40%" }} />
        <span className="rc-pv-line" style={{ width: "70%" }} />
        <span className="rc-pv-line" style={{ width: "48%" }} />
      </div>

      <div className="rc-body">
        <div className="rc-avatar">{initials}</div>
        <div className="rc-identity">
          <h3 className="rc-name">{name}</h3>
          <p className="rc-role">{role}</p>
        </div>
        <span className={`rc-status ${status === "Complete" ? "is-complete" : ""}`}>
          {status}
        </span>
      </div>

      <div className="rc-footer">
        <span className="rc-edited">{lastEdited}</span>
        <div className="rc-actions">
          <button
            type="button"
            className="rc-btn-ghost"
            onClick={onDownload}
            aria-label="Download resume"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          </button>
          <button type="button" className="rc-btn-primary" onClick={onEdit}>
            Edit resume
          </button>
        </div>
      </div>

      <style>{`
        .rc-card {
          width: 100%;
          max-width: 320px;
          background: #FFFFFF;
          border: 1px solid #E7E5E0;
          border-radius: 14px;
          overflow: hidden;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          color: #22242C;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .rc-card:hover {
          box-shadow: 0 16px 32px -16px rgba(34,36,44,0.22);
          transform: translateY(-3px);
        }
        .rc-preview {
          position: relative;
          height: 118px;
          background: #F6F4F0;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          border-bottom: 1px solid #EFEDE8;
        }
        .rc-pv-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #C9C4B8;
          margin-bottom: 4px;
        }
        .rc-pv-line {
          height: 7px;
          border-radius: 4px;
          background: #DEDBD3;
        }
        .rc-pv-line.accent {
          background: #B7546C;
          opacity: 0.6;
        }
        .rc-body {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 18px 20px 14px;
        }
        .rc-avatar {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #7C3048;
          color: #FBEEF1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .rc-identity {
          flex: 1;
          min-width: 0;
        }
        .rc-name {
          margin: 0;
          font-family: "Lora", Georgia, serif;
          font-size: 1.08rem;
          font-weight: 600;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rc-role {
          margin: 2px 0 0;
          font-size: 0.85rem;
          color: #6B6E7A;
        }
        .rc-status {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          background: #F1EFEA;
          color: #565A66;
        }
        .rc-status.is-complete {
          background: #E8F0EA;
          color: #3E7050;
        }
        .rc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px 18px;
          border-top: 1px solid #F1EFEA;
          margin-top: 4px;
        }
        .rc-edited {
          font-size: 0.78rem;
          color: #6B6E7A;
        }
        .rc-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rc-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E7E5E0;
          background: transparent;
          color: #6B6E7A;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .rc-btn-ghost:hover {
          background: #F6F4F0;
          color: #22242C;
        }
        .rc-btn-primary {
          font-size: 0.85rem;
          font-weight: 600;
          color: #FBEEF1;
          background: #7C3048;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .rc-btn-primary:hover {
          background: #642539;
        }
        .rc-btn-primary:focus-visible,
        .rc-btn-ghost:focus-visible {
          outline: 2px solid #7C3048;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
