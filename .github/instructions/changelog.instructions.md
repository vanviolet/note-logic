---
applyTo: '**'
---

After each prompt, please create a file in .prompt-log with a file name that uses the date and time of the prompt, for example: [increment]-28-January-2025.21-56-29.md

Example Content:

```md

---
date: 2024-06-12 15:30:00
author: vanviolet
session-chat: EVALUATING TEMPLATE FOLDER FOR AI READINESS
---

## Prompt
Analisa semua isi folder templates agar template ini siap pakai menggunakan AI dan agar rapih codingan yang di buatnya


## Point OF AI Response 
What’s Missing / Needs Cleanup Before the Templates Feel “AI‑Ready”

SSR/client guards. The theme provider touches localStorage during the initial useState call, which still executes on the server and will crash Remix/Next SSR entry points (theme-provider.tsx:23-55). Wrap the initializer in typeof window !== "undefined" and defer to useEffect so AI‑generated code can reuse the provider without sprinkling guards everywhere.



```