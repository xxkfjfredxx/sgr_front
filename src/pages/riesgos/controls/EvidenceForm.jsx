import { useState } from "react"
import api from "@/services/api"

export function EvidenceForm({ controlId, onUploaded }) {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("description", description)
    formData.append("control", controlId)

    await api.post("/riesgos/control-evidences/", formData)
    setFile(null)
    setDescription("")
    onUploaded?.()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>📤 Upload Evidence</h4>
      <input
        type="file"
        required
        onChange={(e) => setFile(e.target.files[0])}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-textarea mt-2"
      />
      <button type="submit" className="btn btn-primary mt-2">Upload</button>
    </form>
  )
}
