export const defaultLocale = "zh" as const
export const locales = ["zh", "en"] as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
}

export const localeFlags: Record<Locale, string> = {
  zh: "🇨🇳",
  en: "🇺🇸",
}
