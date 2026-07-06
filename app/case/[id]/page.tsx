import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile, projects, siteUrl } from "@/lib/content";
import { evidenceImage } from "@/lib/assets";
import SiteShell from "@/components/shell/SiteShell";
import CaseHeader from "@/components/case/CaseHeader";
import CaseEntrance from "@/components/case/CaseEntrance";
import CaseTimeline from "@/components/case/CaseTimeline";
import EvidenceGrid from "@/components/case/EvidenceGrid";
import ImpactStats from "@/components/case/ImpactStats";
import CaseNav from "@/components/case/CaseNav";
import Annotation from "@/components/detective/Annotation";
import Reveal from "@/components/primitives/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `Case #${project.caseNo} · ${project.title}`,
    description: project.summary,
    openGraph: {
      title: `Case #${project.caseNo} · ${project.title}`,
      description: project.summary,
      url: `${siteUrl}/case/${project.id}`,
    },
  };
}

function Kicker({
  children,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  /** Section kickers are the page's real h2s (keeps heading order valid). */
  as?: "h2" | "p";
}) {
  return (
    <Tag className="mb-3 font-mono text-[11px] tracking-[0.35em] text-signal">
      {children}
    </Tag>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-2xl text-lg leading-relaxed text-bone/80">{children}</p>
  );
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const cs = project.caseStudy;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    dateCreated: project.year,
    keywords: project.tags.join(", "),
    url: `${siteUrl}/case/${project.id}`,
    author: { "@type": "Person", name: profile.name },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // escape "<" so owner-edited content can never break out of the tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CaseHeader project={project} />
      <CaseEntrance>
        <main id="main" className="relative mx-auto max-w-4xl px-6 pb-28 sm:px-10">
          <Annotation id="case" className="absolute right-6 top-24 sm:right-10" />

          {/* dossier hero */}
          <section className="py-12 sm:py-24">
            <Kicker as="p">CASE #{project.caseNo} · {project.year}</Kicker>
            <h1 className="display text-[clamp(3rem,10vw,8rem)] text-bone">
              {project.title}
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-ash">
              {project.category}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-slate/80 px-2.5 py-1 font-mono text-[10px] tracking-widest text-bone/75"
                >
                  {tag}
                </span>
              ))}
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-wipe ml-2 font-mono text-[10px] tracking-widest text-ash"
              >
                VIEW CODE ↗
              </a>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-wipe ml-2 font-mono text-[10px] tracking-widest text-signal"
                >
                  LIVE ↗
                </a>
              )}
            </div>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>01 · CONTEXT</Kicker>
              <Body>{cs.context}</Body>
            </Reveal>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>02 · THE PROBLEM</Kicker>
              <Body>{cs.problem}</Body>
            </Reveal>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>03 · INVESTIGATION</Kicker>
            </Reveal>
            <div className="mt-8">
              <CaseTimeline steps={cs.investigation} />
            </div>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>04 · RESOLUTION</Kicker>
              <Body>{cs.resolution}</Body>
            </Reveal>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>05 · EVIDENCE</Kicker>
            </Reveal>
            <div className="mt-8">
              <EvidenceGrid
                project={project}
                images={cs.evidence.map((ev) => evidenceImage(project.id, ev.id))}
              />
            </div>
          </section>

          <section className="border-t border-slate/40 py-10 sm:py-14">
            <Reveal>
              <Kicker>06 · IMPACT</Kicker>
            </Reveal>
            <div className="mt-8">
              <ImpactStats stats={cs.impact} />
            </div>
          </section>

          <CaseNav currentId={project.id} />
        </main>
      </CaseEntrance>
    </SiteShell>
  );
}
