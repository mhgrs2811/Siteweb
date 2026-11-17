import { copy } from "@/data/copy";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/layout/PageIntro";

export default function NotFound() {
  const n = copy.notFound;
  return (
    <PageIntro
      chapter="404"
      label="Erreur"
      title={n.h1}
      lead={n.text}
      aside={
        <>
          <Button href={routes.home}>{n.cta}</Button>
          <Button href={routes.menu} variant="ghost">
            {n.ctaMenu}
          </Button>
        </>
      }
    />
  );
}
