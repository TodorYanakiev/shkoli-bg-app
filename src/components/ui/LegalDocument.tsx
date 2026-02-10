export type LegalDocumentSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  closingParagraphs?: string[]
}

type LegalDocumentProps = {
  title: string
  lastUpdated: string
  sections: LegalDocumentSection[]
}

const LegalDocument = ({ title, lastUpdated, sections }: LegalDocumentProps) => (
  <section className="mx-auto w-full max-w-4xl space-y-8">
    <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
    <div className="space-y-6">
      {sections.map((section) => (
        <article key={section.title} className="space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold leading-7 text-slate-900">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph, index) => (
            <p key={`${section.title}-paragraph-${index}`}>{paragraph}</p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc space-y-1 pl-6">
              {section.bullets.map((bullet, index) => (
                <li key={`${section.title}-bullet-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {section.closingParagraphs?.map((paragraph, index) => (
            <p key={`${section.title}-closing-paragraph-${index}`}>{paragraph}</p>
          ))}
        </article>
      ))}
    </div>
    <p className="text-sm font-medium text-slate-700">{lastUpdated}</p>
  </section>
)

export default LegalDocument
