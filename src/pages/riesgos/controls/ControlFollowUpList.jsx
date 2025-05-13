export function ControlFollowUpList({ followUps }) {
    if (!followUps.length) return <p>No follow-ups recorded yet.</p>
  
    return (
      <div className="followup-list">
        {followUps.map((fu) => (
          <div key={fu.id} className="card mb-2">
            <p><strong>Date:</strong> {new Date(fu.date).toLocaleDateString()}</p>
            <p><strong>Controlled:</strong> {fu.is_controlled ? "✅ Yes" : "❌ No"}</p>
            <p>{fu.notes}</p>
            {fu.performed_by && (
              <p><strong>Performed by:</strong> {fu.performed_by.first_name}</p>
            )}
          </div>
        ))}
      </div>
    )
  }
  