import { useEffect, useState } from "react"
import api from "@/services/api"

export function useControlFollowUps(controlId) {
  const [followUps, setFollowUps] = useState([])

  const fetchFollowUps = async () => {
    const res = await api.get(`/riesgos/control-followups/?control=${controlId}`)
    setFollowUps(res.data)
  }

  useEffect(() => {
    if (controlId) fetchFollowUps()
  }, [controlId])

  return {
    followUps,
    reload: fetchFollowUps,
  }
}
