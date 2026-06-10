/**
 * Noir palette — mirrors the @theme tokens in app/globals.css.
 * Import these when a color is needed in JS (canvas rain, inline glows).
 */
export const noir = {
  void: "#050507",
  ink: "#0b0b0f",
  coal: "#14141a",
  slate: "#2a2d36",
  ash: "#99a1b0",
  bone: "#e8e6e0",
  signal: "#f5b21a",
  signalHot: "#ffd24a",
  scan: "#2dd4bf", // Detective Mode only
} as const;
