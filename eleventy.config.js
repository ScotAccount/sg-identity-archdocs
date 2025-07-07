import { govukEleventyPlugin } from '@x-govuk/govuk-eleventy-plugin'

export default function(eleventyConfig) {
  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin, {
    // Optional: Specify the path to the GOV.UK Frontend assets
    header: {
      productName: 'SG Identity Architecture Documentation',
      organisationName: 'Scottish Government',
      organisationLogo: false
    }
  })
  eleventyConfig.addPassthroughCopy('app/assets/css')

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    pathPrefix: process.env.GITHUB_ACTIONS ? '/sg-identity-archdocs/' : '/',
    dir: {
      // The folder where all your content will live:
      input: 'app',
    }
  }
};