<script>
  import { page } from "$app/state";
  import { ErrorPage } from "@dg/ui";

  // The /404 route renders this page without an error to emit the static host's 404.html.
  const status = $derived(page.error ? page.status : 404);
</script>

<svelte:head>
  <title>{status} — Error</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<ErrorPage {status} />
