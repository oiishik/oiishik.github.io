/** Popular mailbox domains offered after the visitor types "@". */
export const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "rediffmail.com"] as const;

/** Up to three full addresses matching the text typed after "@". */
export function emailDomainSuggestions(value: string): string[] {
  const at = value.lastIndexOf("@");
  if (at < 0) return [];

  const local = value.slice(0, at);
  const typed = value.slice(at + 1).toLowerCase();
  if (/\s/.test(value)) return [];

  return EMAIL_DOMAINS.filter((domain) => domain.startsWith(typed) && domain !== typed)
    .slice(0, 3)
    .map((domain) => `${local}@${domain}`);
}
