/* ── Password Utility Functions ── */

export interface PasswordCondition {
  id: string;
  label: string;
  met: boolean;
}

/**
 * Check password against all conditions.
 * Returns an array of conditions with their pass/fail status.
 */
export function checkPasswordConditions(
  password: string,
  username: string
): PasswordCondition[] {
  const usernameLC = username.toLowerCase();

  return [
    {
      id: "length",
      label: "At least 16 characters",
      met: password.length >= 16,
    },
    {
      id: "uppercase",
      label: "At least 1 uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least 1 lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least 1 number",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least 1 special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: "no-username",
      label: "Does not contain username",
      met:
        usernameLC.length === 0 ||
        !password
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .includes(usernameLC.replace(/[^a-z0-9]/g, "")),
    },
  ];
}

/**
 * Estimate how long it would take to crack the password
 * using brute-force, based on character-set entropy.
 *
 * Assumes 10 billion guesses per second (modern GPU cluster).
 */
export function estimateCrackTime(password: string): string {
  if (password.length === 0) return "—";

  // Determine character pool size
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 33;

  if (poolSize === 0) return "—";

  // Total combinations = poolSize ^ length
  // Time in seconds = combinations / guesses_per_second
  const guessesPerSecond = 10_000_000_000; // 10 billion (high-end GPU cluster)

  // Use logarithms to avoid overflow with large numbers
  const logCombinations = password.length * Math.log10(poolSize);
  const logGuessesPerSec = Math.log10(guessesPerSecond);
  const logSeconds = logCombinations - logGuessesPerSec;

  // Convert log-seconds to actual time
  if (logSeconds < 0) return "Instant";

  const seconds = Math.pow(10, Math.min(logSeconds, 30)); // cap to avoid Infinity

  if (seconds < 1) return "Instant";
  if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? "s" : ""}`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minute${Math.round(seconds / 60) !== 1 ? "s" : ""}`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hour${Math.round(seconds / 3600) !== 1 ? "s" : ""}`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} day${Math.round(seconds / 86400) !== 1 ? "s" : ""}`;
  if (seconds < 86400 * 365 * 1000) return `${Math.round(seconds / (86400 * 365))} year${Math.round(seconds / (86400 * 365)) !== 1 ? "s" : ""}`;
  if (seconds < 86400 * 365 * 1_000_000) return `${Math.round(seconds / (86400 * 365 * 1000))} thousand years`;
  if (seconds < 86400 * 365 * 1_000_000_000) return `${Math.round(seconds / (86400 * 365 * 1_000_000))} million years`;

  return `${(seconds / (86400 * 365 * 1_000_000_000)).toExponential(1)} billion years`;
}

/**
 * Returns a strength label based on how many conditions are met.
 */
export function getPasswordStrength(
  conditions: PasswordCondition[]
): { label: string; color: string; percent: number } {
  const metCount = conditions.filter((c) => c.met).length;
  const percent = Math.round((metCount / conditions.length) * 100);

  if (metCount <= 1) return { label: "Very Weak", color: "#ef4444", percent };
  if (metCount <= 2) return { label: "Weak", color: "#f97316", percent };
  if (metCount <= 3) return { label: "Fair", color: "#eab308", percent };
  if (metCount <= 4) return { label: "Good", color: "#22c55e", percent };
  if (metCount <= 5) return { label: "Strong", color: "#14b8a6", percent };
  return { label: "Excellent", color: "#06b6d4", percent };
}
