import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import { useControlEvidences } from "@/hooks/riesgos/useControlEvidences"
import { useControlFollowUps } from "@/hooks/riesgos/useControlFollowUps"
import { EvidenceForm } from "@/components/riesgos/controls/EvidenceForm"
import { FollowUpForm } from "@/components/riesgos/controls/FollowUpForm"
import { ControlEvidenceList } from "@/components/riesgos/controls/ControlEvidenceList"
import { ControlFollowUpList } from "@/components/riesgos/controls/ControlFollowUpList"
import api from "@/services/api"

const ControlDetailPage = () => {
  const { id } = useParams()
  const controlId = Number(id)

  const { data: control, isLoading } = useQuery(["control", controlId], async () => {
    const { data } = await api.get(`/riesgos/controls/${controlId}/`)
    return data
  })

  const { data: evidences } = useControlEvidences(controlId)
  const { data: followUps } = useControlFollowUps(controlId)

  if (isLoading) return <p>Loading control details...</p>

  return (
    <div className="container">
      <h2>🛡️ Risk Control Details</h2>

      <div className="card mb-4">
        <h4>{control.description}</h4>
        <p><strong>Responsible:</strong> {control.responsible?.first_name || "Unassigned"}</p>
        <p><strong>Due date:</strong> {control.due_date}</p>
        <p><strong>Implemented:</strong> {control.implemented ? "✅ Yes" : "❌ No"}</p>
      </div>

      {/* Evidences */}
      <div className="mb-5">
        <h3>📎 Control Evidences</h3>
        <EvidenceForm controlId={controlId} />
        <ControlEvidenceList controlId={controlId} evidences={evidences || []} />
      </div>

      {/* Follow-Ups */}
      <div>
        <h3>📝 Follow-Up Records</h3>
        <FollowUpForm controlId={controlId} />
        <ControlFollowUpList controlId={controlId} followUps={followUps || []} />
      </div>
    </div>
  )
}

export default ControlDetailPage
