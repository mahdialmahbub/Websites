import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import TemplateCard from "../../components/templates/TemplateCard";
import TemplateThumb from "../../components/templates/TemplateThumb";
import { categoryPath, getTemplate, getTemplates, templatePath } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { Button } from "@/app/components/Button";
import { icons } from "../../../../assets/iconCollection";
import { deriveSeo } from "@/lib/seo/derive";

// /templates/professional - one template: big preview, description, "Use this template", related templates.
// "category" is a static route (/templates/category/...), so a template can never take that slug.

const SLUG = /^[a-z0-9-]{1,60}$/;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const template = SLUG.test(slug) ? await getTemplate(slug) : null;
  if (!template) return { title: "Template not found", robots: { index: false, follow: false } };

  return buildMetadata(deriveSeo(template));
}

export default async function TemplatePage({ params }) {
  const { slug } = await params;
  if (!SLUG.test(slug)) notFound();
  const template = await getTemplate(slug);
  if (!template) notFound();

  const { name, description, category } = template;
  const related = category
    ? ((await getTemplates({ category: category.slug, limit: 5 }))?.templates ?? []).filter((item) => item.slug !== slug).slice(0, 4)
    : [];

  // Ei list ei visible breadcrumb ar JSON-LD, duitor source
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },
    ...(category ? [{ name: category.name, href: categoryPath(category.slug) }] : []),
    { name, href: templatePath(slug) },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-[320px] max-w-300 flex-col gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(1rem,calc(6.009vw+0.592rem),2rem)] mb-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${absoluteUrl(templatePath(slug))}#webpage`,
          url: absoluteUrl(templatePath(slug)),
          name: `${name} Resume Template`,
          description: description || undefined,
          inLanguage: "en",
          isPartOf: { "@id": absoluteUrl("/#website") }, // siteSchema er WebSite er shathe link
        }}
      />

      <div className="-mb-2.5 flex flex-col gap-1">
        <Link
          href="/templates"
          className="h-11 flex items-center gap-[clamp(0.375rem,calc(0.188vw+0.331rem),0.5rem)] text-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] font-primary font-medium text-neutral-500 max-w-max"
        >
          <Button variant="text" icon={icons.left}>Back</Button>
        </Link>

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-caption text-neutral-500/70">
            {crumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === crumbs.length - 1 ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <article className="grid items-start gap-[clamp(1.5rem,calc(3.005vw+0.796rem),3.5rem)] md:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="overflow-hidden rounded-2xl border border-neutral-500/10 bg-white shadow-[0_6px_8px_rgba(2,6,23,0.10)]">
          <TemplateThumb slug={slug} name={name} />
        </div>

        <div className="space-y-4">
          {category && (
            <Link href={categoryPath(category.slug)} className="inline-block rounded-full bg-violet-500/5 px-3 py-1 text-[12px] font-medium text-violet-500 hover:bg-violet-500/10">
              {category.name}
            </Link>
          )}
          <h1 className="font-primary text-[clamp(1.5rem,calc(1.878vw+1.06rem),2.75rem)] font-semibold">{name} Resume Template</h1>
          {description && <p className="text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] text-[#5C5C61]/80">{description}</p>}
          <ul className="list-disc space-y-1 pl-5 text-small text-[#5C5C61]/80">
            <li>ATS-friendly layout that recruiters and scanners can read</li>
            <li>Change the colour and template any time, your content stays</li>
            <li>Download as PDF or share a link</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/builder?template=${encodeURIComponent(slug)}`}
              rel="nofollow"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary-300 px-5 font-medium text-primary-50 outline-none transition-colors hover:bg-[#4338CA] focus-visible:ring-[3px] focus-visible:ring-indigo-300"
            >
              Use this template
            </Link>
            <Link href="/templates" className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-500/10 px-5 font-medium hover:bg-neutral-500/5">
              All templates
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-5">
          <h2 id="related-heading" className="font-primary text-[clamp(1.125rem,calc(0.939vw+0.905rem),1.75rem)] font-semibold">
            More {category.name.toLowerCase()} templates
          </h2>
          <ul className="flex flex-wrap items-start gap-[clamp(1.5rem,calc(3.005vw+0.796rem),3.5rem)]">
            {related.map((item) => (
              <li key={item.slug}>
                <TemplateCard template={item} alwaysActive />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}