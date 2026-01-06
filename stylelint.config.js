/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
  ],
  rules: {
    // To make it easier to discriminate
    // keywords (without quotes) and font names (with quotes)
    "font-family-name-quotes": "always-unless-keyword",

    //
    // Style Preferences
    //
    "color-hex-length": "long",

    //
    // Disabled
    //

    // Not working for TailwindCSS?
    "at-rule-descriptor-value-no-unknown": null,

    //
    // Disabled ― Style Preferences
    //
    "custom-property-empty-line-before": null,
  },
};
