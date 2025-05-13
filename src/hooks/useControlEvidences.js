import { useEffect, useState } from "react"
import api from "@/services/api"

export function useControlEvidences(controlId) {
  const [evidences, setEvidences] = useState([])

  const fetchEvidences = async () => {
    const res = await api.get(`/riesgos/control-evidences/?control=${controlId}`)
    setEvidences(res.data)
  }

  useEffect(() => {
    if (controlId) fetchEvidences()
  }, [controlId])

  return {
    evidences,
    reload: fetchEvidences,
  }
}
