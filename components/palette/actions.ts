import { projects, profile } from "@/lib/content";

export type PaletteGroup = "NAVIGATE" | "CASE FILES" | "SYSTEMS";

export interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  group: PaletteGroup;
  /** Keep the palette open after running (e.g. to show COPIED feedback). */
  keepOpen?: boolean;
  run: () => void;
}

export interface PaletteDeps {
  goToSection: (id: string) => void;
  openCase: (id: string) => void;
  toggleDetective: () => void;
  detectiveOn: boolean;
  toggleLights: () => void;
  lightsOn: boolean;
  canEnhance: boolean;
  copyEmail: () => void;
  fireSignal: () => void;
  replayBoot: () => void;
  toggleSound: () => void;
  soundOn: boolean;
}

const SECTIONS: { id: string; label: string }[] = [
  { id: "top", label: "TOP — THE ROOFTOP" },
  { id: "work", label: "CASES — SELECTED WORK" },
  { id: "about", label: "DOSSIER — ABOUT" },
  { id: "playground", label: "WORKSHOP — R&D" },
  { id: "log", label: "STAKEOUT — SURVEILLANCE LOG" },
  { id: "contact", label: "SIGNAL — CONTACT" },
];

export function buildActions(d: PaletteDeps): PaletteAction[] {
  const actions: PaletteAction[] = [];

  for (const s of SECTIONS) {
    actions.push({
      id: `nav-${s.id}`,
      label: s.label,
      group: "NAVIGATE",
      run: () => d.goToSection(s.id),
    });
  }

  for (const p of projects) {
    actions.push({
      id: `case-${p.id}`,
      label: `CASE #${p.caseNo} — ${p.title}`,
      hint: p.category.toUpperCase(),
      group: "CASE FILES",
      run: () => d.openCase(p.id),
    });
  }

  actions.push({
    id: "sys-detective",
    label: `DETECTIVE MODE: ${d.detectiveOn ? "OFF" : "ON"}`,
    hint: "[D]",
    group: "SYSTEMS",
    run: d.toggleDetective,
  });
  if (d.canEnhance) {
    actions.push({
      id: "sys-lights",
      label: d.lightsOn ? "LIGHTS OFF — RESTORE THE DARK" : "LIGHTS ON — FULL VISIBILITY",
      group: "SYSTEMS",
      run: d.toggleLights,
    });
  }
  actions.push(
    {
      id: "sys-copy-email",
      label: "COPY EMAIL ADDRESS",
      hint: profile.email.toUpperCase(),
      group: "SYSTEMS",
      keepOpen: true,
      run: d.copyEmail,
    },
    {
      id: "sys-sound",
      label: `AMBIENT SOUND: ${d.soundOn ? "OFF" : "RAIN"}`,
      group: "SYSTEMS",
      run: d.toggleSound,
    },
    {
      id: "sys-signal",
      label: "FIRE THE SIGNAL",
      hint: "EASTER EGG",
      group: "SYSTEMS",
      run: d.fireSignal,
    },
    {
      id: "sys-boot",
      label: "REPLAY BOOT SEQUENCE",
      group: "SYSTEMS",
      run: d.replayBoot,
    },
  );

  return actions;
}
