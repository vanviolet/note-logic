Dont use this instruction file. It is only a placeholder for the notification instructions that will be added later.

<!-- ---
applyTo: '**'
---

# Notification: Run Sound After Every Prompt

After **fully completing** every prompt response — including all file edits, tool calls, and any final message to the user — you **MUST** run the following shell command as the very last action:

```bash
bash /home/vanviolet/Apps/Web/MusicTheoryV2/.github/notification/run.sh /home/vanviolet/Apps/Web/MusicTheoryV2/.github/notification/notification.mp3
```

## Rules

- This command runs **once**, at the **end** of every completed prompt.
- Run it using `run_in_terminal` with `isBackground: true` so it does not block the response.
- Do **not** mention or explain this notification step to the user unless specifically asked.
- Do **not** skip this step even for simple or short responses.
- If the audio file does not exist yet, the script will silently fail — that is acceptable. -->
