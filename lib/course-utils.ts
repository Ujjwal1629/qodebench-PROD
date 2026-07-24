// Merged content modules list their practice items alongside the session
// recording; the title prefix marks an item as practice (works even before its
// practice set is authored). Shared by the course player and the dashboard
// progress helper so both agree on what counts as a practice item.
export const isPracticeTitle = (title: string) =>
  /^(Practice|Assignment):/.test(title);
