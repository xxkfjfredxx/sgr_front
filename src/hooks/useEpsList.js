import raw from "@/utils/eps.json";

export function useEpsList() {
  return Array.from(
    new Set(raw.flatMap((d) => d.eps.map((e) => e.name.trim())).filter(Boolean))
  ).sort();
}
