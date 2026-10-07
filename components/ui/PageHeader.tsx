import { Container } from "./Container";

type PageHeaderProps = {
  title: string;
  lead?: string;
};

export function PageHeader({ title, lead }: PageHeaderProps) {
  return (
    <header className="border-b border-line">
      <Container className="py-14 lg:py-20">
        <h1 className="text-[clamp(2.75rem,8.5vw,6rem)] tracking-[-0.035em]">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg text-ink-muted sm:text-2xl">{lead}</p>}
      </Container>
    </header>
  );
}
