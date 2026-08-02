import Link from "next/link";

type PdfPreviewPageProps = {
  searchParams?: {
    src?: string;
    title?: string;
  };
};

export default function PdfPreviewPage({ searchParams }: PdfPreviewPageProps) {
  const src = searchParams?.src ?? "";
  const title = searchParams?.title ?? "PDF evidence";
  const isAllowedPdf =
    /^https:\/\/pub-0d63e00396f84c818d577fbc98732ebd\.r2\.dev\/.+\.pdf$/i.test(
      src,
    );

  return (
    <main className="route-main route-content route-enter pdf-preview-page">
      <section className="pdf-preview-shell">
        <header className="pdf-preview-header">
          <Link href="/evidence#professional-practice-evidence">
            Back to evidence
          </Link>
          <h1>{title}</h1>
          {isAllowedPdf ? (
            <a href={src} rel="noreferrer" target="_blank">
              Open original
            </a>
          ) : null}
        </header>

        {isAllowedPdf ? (
          <iframe className="pdf-preview-frame" src={src} title={title} />
        ) : (
          <p className="pdf-preview-error">
            This PDF preview link is missing or invalid.
          </p>
        )}
      </section>
    </main>
  );
}

