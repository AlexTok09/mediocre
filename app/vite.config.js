import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { createViteConfig } from "@dg/ui/config/vite.js";

export default createViteConfig(sveltekit, adapter);
