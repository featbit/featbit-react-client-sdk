import { useFlags } from "@featbit/react-client-sdk";

export const useFeatureFlag = <T = boolean>(flagKey: string, defaultValue?: T): T => {
  const flags = useFlags()
  const flagValue = flags[flagKey]

  return (flagValue ?? defaultValue) as T
}