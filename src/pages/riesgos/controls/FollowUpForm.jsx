import { useState } from "react"
import api from "@/services/api"

export function FollowUpForm({ controlId, onSubmitted }) {
  const [notes, setNotes] = useState("")
  const [isControlled, setIsControlled] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post("/riesgos/control-followups/", {
      control: controlId,
      notes,
      is_controlled: isControlled,
    })
    setNotes("")
    setIsControlled(false)
    onSubmitted?.()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>➕ Add Follow-Up</h4>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Follow-up notes"
        className="form-textarea"
      />
      <div className="form-check mt-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isControlled}
          onChange={(e) => setIsControlled(e.target.checked)}
          id="isControlled"
        />
        <label className="form-check-label" htmlFor="isControlled">
          Is control effective?
        </label>
      </div>
      <button type="submit" className="btn btn-success mt-2">Submit</button>
    </form>
  )
}
