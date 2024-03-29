import { Tables } from "@/supabase/types"
import { ModelProvider } from "@/types"
import { VALID_KEYS } from "@/types/valid-keys"

export const isModelLocked = async (
  provider: ModelProvider,
  profile: Tables<"profiles">
): Promise<Boolean> => {
  if (!profile) return false

  const key = providerToKeyMap[provider]

  if (!key) {
    return false
  }

  const response = await fetch("/api/retrieval/keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ key })
  })

  if (!response.ok) {
    return false
  }

  const { isUsing } = (await response.json()) as {
    isUsing: boolean
  }

  switch (provider) {
    case "openai":
      return !(isUsing || profile.openai_api_key)
    case "google":
      return !(isUsing || profile.google_gemini_api_key)
    case "anthropic":
      return !(isUsing || profile.anthropic_api_key)
    case "mistral":
      return !(isUsing || profile.mistral_api_key)
    case "perplexity":
      return !(isUsing || profile.perplexity_api_key)
    default:
      return false
  }
}

export const providerToKeyMap = {
  openai: VALID_KEYS.OPENAI_API_KEY,
  google: VALID_KEYS.GOOGLE_GEMINI_API_KEY,
  anthropic: VALID_KEYS.ANTHROPIC_API_KEY,
  mistral: VALID_KEYS.MISTRAL_API_KEY,
  perplexity: VALID_KEYS.PERPLEXITY_API_KEY,
  // Note: Azure OpenAI uses the same key as OpenAI
  llama: false,
  ollama: false
}
