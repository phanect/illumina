// TODO Remove imports you don't use
import { core, nodejs, unbundled } from "@phanect/lint";
import { vue, nuxt } from "@phanect/lint-vue";
import { svelte } from "@phanect/lint-svelte";
import { astro } from "@phanect/lint-astro";
import type { Linter } from "eslint";

const configs: Linter.Config[] = [
  {
    ignores: [
      "./**/dist/**",
    ],
  },

  ...core,
  // TODO Add if you need
  // ...nodejs,
  // ...unbundled,
  // ...vue,
  // ...nuxt,
  // ...svelte,
  // ...astro,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        projectService: true,
        // TODO Use `project: true` instead if you use `astro` ruleset.
        // project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

export default configs;
