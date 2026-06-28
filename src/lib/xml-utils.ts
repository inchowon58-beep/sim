export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toRfc822Date(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}
