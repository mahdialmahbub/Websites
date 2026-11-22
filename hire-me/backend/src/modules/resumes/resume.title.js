/** "Mahdi Al Mahbub" -> "Mahdi's resume". Shudhu prothom word. Name na thakle "My resume". */
export function buildResumeTitle(name) {
  const firstName = String(name ?? "").trim().split(/\s+/)[0];
  return (firstName ? `${firstName}'s resume` : "My resume").slice(0, 100);
}