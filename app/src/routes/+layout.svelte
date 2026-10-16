<script>
  import "@dg/ui/styles.css";
  import icon from "@dg/ui/logo.svg";
  import { page } from "$app/state";
  import { Footer, Header, Main, Page, SkipLink } from "@dg/ui";

  /** @type {{ children?: import('svelte').Snippet }} */
  let { children } = $props();
  const links = [
    { label: "Proposer", href: "/#proposer" },
    { label: "Aphorismes", href: "/#aphorismes" },
    { label: "À propos", href: "https://lundi.am/classemediocre-com" },
  ];
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href={icon} />
</svelte:head>

<Page lang="fr">
  <SkipLink />
  <Header app="classe médiocre" {links} path={page.url.pathname} />
  <Main>{@render children?.()}</Main>
  <Footer identity="Le comité de la médiocrité" notice={notice} />
</Page>

{#snippet notice()}
  <a href="mailto:alex@distributedgallery.com">Contacter le comité</a> · <a href="https://lundi.am/classemediocre-com">Lire l'article sur lundi.am</a>
{/snippet}
