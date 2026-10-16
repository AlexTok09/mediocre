<script>
  import { onMount, tick } from "svelte";
  import { Button, Heading, Section, SectionHead } from "@dg/ui";

  // Submissions are mailed through FormSubmit and moderated by hand into aphorismes.json.
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/9bb8a299d5d83ccd35662cbac376dacc";

  /** @type {{ texte: string, date: string }[]} */
  let aphorisms = $state([]);
  let loading = $state("pending");

  let text = $state("");
  let honey = $state("");
  let attempted = $state(false);
  let status = $state("ready");
  let feedback = $state("");
  /** @type {HTMLTextAreaElement} */
  let input;
  const invalid = $derived(attempted && !text.trim());

  // The list is fetched at runtime so moderation only edits the JSON file, without a rebuild.
  onMount(async () => {
    try {
      const response = await fetch("/aphorismes.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      aphorisms = await response.json();
      loading = "done";
    } catch {
      loading = "failed";
    }
  });

  const formatDate = (date) => date.split("-").reverse().join("/");

  async function submit(event) {
    event.preventDefault();
    if (status === "pending") return;
    attempted = true;
    if (invalid) {
      feedback = "Écrivez un aphorisme avant d'envoyer.";
      input.focus();
      return;
    }
    status = "pending";
    feedback = "Envoi en cours.";
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          aphorisme: text.trim(),
          _subject: "[classemediocre] Nouvelle proposition",
          _template: "box",
          _captcha: "false",
          _honey: honey,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      status = "success";
      feedback = "Merci ! Votre aphorisme a été soumis au comité de la médiocrité.";
      text = "";
      attempted = false;
    } catch {
      status = "failed";
      feedback = "L'envoi a échoué. Votre texte est conservé, réessayez.";
    }
    await tick();
    input.focus();
  }
</script>

<svelte:head>
  <title>Le sujet de la classe médiocre</title>
  <meta name="description" content="Aphorismes sur le sujet de la classe médiocre, proposés par les visiteurs et validés par le comité de la médiocrité." />
</svelte:head>

<Heading title="Le sujet de la classe médiocre" metadata={loading === "done" ? `${aphorisms.length} aphorismes` : ""} />

<Section id="proposer">
  <SectionHead num="01" title="Proposer" />
  <form class="stack" novalidate onsubmit={submit} aria-busy={status === "pending"}>
    <div class="stack control-gap">
      <label class="field-label" for="aphorisme">Votre aphorisme</label>
      <textarea
        id="aphorisme"
        rows="3"
        required
        placeholder="Le sujet de la classe médiocre…"
        bind:value={text}
        bind:this={input}
        disabled={status === "pending"}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "aphorisme-help aphorisme-error" : "aphorisme-help"}
      ></textarea>
      <p class="field-help" id="aphorisme-help">Chaque proposition est lue par le comité avant publication.</p>
      {#if invalid}<p class="field-error" id="aphorisme-error">Le champ est vide.</p>{/if}
    </div>
    <!-- Spam trap: hidden from people, filled by bots. -->
    <input class="honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" bind:value={honey} />
    <Button type="submit" variant="accent" label="Envoyer" disabled={status === "pending"} />
  </form>
  <p role="status" class="feedback" data-tone={status === "failed" || invalid ? "error" : status === "pending" ? "info" : "success"}>{feedback}</p>
</Section>

<Section id="aphorismes">
  <SectionHead num="02" title="Aphorismes" count={loading === "done" ? `${aphorisms.length}` : ""} />
  {#if loading === "pending"}
    <p class="feedback" data-tone="info" role="status">Chargement des aphorismes.</p>
  {:else if loading === "failed"}
    <p class="feedback" data-tone="error" role="alert">Les aphorismes n'ont pas pu être chargés. Rechargez la page.</p>
  {:else if aphorisms.length === 0}
    <p class="feedback">Aucun aphorisme approuvé pour le moment.</p>
  {:else}
    <ol>
      {#each aphorisms as { texte, date }, i (i)}
        <li>
          <p class="prose">{texte}</p>
          {#if date}<time class="metadata" datetime={date}>{formatDate(date)}</time>{/if}
        </li>
      {/each}
    </ol>
  {/if}
</Section>

<style>
  /* Wide enough for a long aphorism on one or two lines. */
  form {
    max-width: 48rem;
  }

  .honey {
    display: none;
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-5);
    align-items: baseline;
    justify-content: space-between;
    padding-block: var(--space-4);
    border-top: var(--border-width) solid var(--border-subtle);
  }

  li:first-child {
    border-top: 0;
    padding-top: 0;
  }

  li p {
    flex: 1 1 30rem;
    margin: 0;
    max-width: var(--formatted-max-width);
  }

  time {
    flex: none;
  }
</style>
