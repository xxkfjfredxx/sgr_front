export function ControlEvidenceList({ evidences }) {
    if (!evidences.length) return <p>No evidence uploaded yet.</p>
  
    return (
      <div className="evidence-list">
        {evidences.map((ev) => (
          <div key={ev.id} className="card mb-2">
            <p><strong>Uploaded:</strong> {new Date(ev.uploaded_at).toLocaleDateString()}</p>
            <p>{ev.description}</p>
            <a href={ev.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">📎 View File</a>
          </div>
        ))}
      </div>
    )
  }
  