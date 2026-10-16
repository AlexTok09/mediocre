# classemediocre.com

Le sujet de la classe médiocre : aphorismes proposés par les visiteurs et validés par le comité de la médiocrité.

- `docs/` est le site publié par GitHub Pages (généré, sauf `aphorismes.json`, `CNAME` et `.nojekyll`).
- `docs/aphorismes.json` contient les aphorismes publiés, le plus récent en premier. Le site le lit au chargement : modérer revient à éditer ce fichier, sans rebuild.
- `app/` est le code source (SvelteKit + `@dg/ui` de [distributedgallery/interfaces](https://github.com/distributedgallery/interfaces), dépôt privé).

## Propositions

Le formulaire envoie chaque proposition par mail via FormSubmit (sujet `[classemediocre] Nouvelle proposition`). Pour publier une proposition, l'ajouter en tête de `docs/aphorismes.json` puis pousser sur `main`.

## Modifier le design

Cloner `interfaces` à côté de ce dépôt (`../interfaces`), puis :

```sh
cd app
pnpm install
pnpm dev            # http://localhost:5190
pnpm publish-site   # build puis copie dans ../docs
```
