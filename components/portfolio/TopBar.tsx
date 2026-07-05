import { profile } from "@/lib/content";

/**
 * Site banner + primary nav. A real top-level <header> (rendered BEFORE
 * <main> for a proper banner landmark), absolutely positioned over the hero.
 * Always above the flashlight shroud so it stays readable in the dark.
 */
export default function TopBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 flex flex-wrap items-center justify-between gap-y-3 px-6 pt-6 font-mono text-[10px] tracking-[0.3em] text-ash sm:px-10">
      <span className="text-bone">{profile.name.toUpperCase()}</span>
      <span className="stamp order-2 text-signal md:order-3">
        {profile.status}
      </span>
      <nav
        className="order-3 flex w-full flex-wrap justify-center gap-x-6 md:order-2 md:w-auto md:gap-7"
        aria-label="Sections"
      >
        {/* py-2 = comfortable tap targets on touch */}
        <a href="#work" className="link-wipe py-2">CASES</a>
        <a href="#about" className="link-wipe py-2">DOSSIER</a>
        <a href="#playground" className="link-wipe py-2">WORKSHOP</a>
        <a href="#witnesses" className="link-wipe py-2">WITNESSES</a>
        <a href="#contact" className="link-wipe py-2">SIGNAL</a>
      </nav>
    </header>
  );
}
