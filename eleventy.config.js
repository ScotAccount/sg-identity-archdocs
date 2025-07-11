import govukEleventyPlugin from "@x-govuk/govuk-eleventy-plugin";

export default function (eleventyConfig) {

    // The name of the repo as it appears on GitHub
    const repoName = 'sg-identity-archdocs';

    /** TODO: this should be configured to match the url where this site is hosted. 
      * For example when using a GitHub action to deploy to GitHub pages:
      * 
      * ```javascript
      * const url = process.env.GITHUB_ACTIONS
      *    ? `https://ukhomeoffice.github.io/${repoName}/`
      *    : '/';
      */
    const url = '/';

    /** TODO: If the site is not hosted in the root of the host domain, this should be 
      * the path to the root of the site.
      * 
      * For example when using a GitHub action to deploy to GitHub pages:
      * 
      * ```javascript
      * const pathPrefix = process.env.GITHUB_ACTIONS
      *    ? `/${repoName}/`
      *    : '/';
      */
    const pathPrefix = '/';

    eleventyConfig.addPassthroughCopy({ "app/assets/logos": "assets/logos"});

    const xgovukPluginOptions = {
        // Home Office branding
        scssSettingsPath: "/styles/_settings.scss",
        stylesheets: ['/styles/base.css'],
        icons: {
            mask: '/assets/logos/ho-mask-icon.svg',
            shortcut: '/assets/logos/ho-favicon.ico',
            touch: '/assets/logos/ho-apple-touch-icon.png'
        },
        opengraphImageUrl: '/assets/logos/ho-opengraph-image.png',
        homeKey: 'Home',
        header: {
            logotype: {
                html:
                    '<span class="govuk-header__logotype">' +
                    '  <img src="/assets/logos/ho_logo.svg" height="34px" alt="Scottish Government Logo">' +
                    '  <span class="govuk-header__logotype-text">Scottish Government</span>' +
                    '</span>'
            },
            productName: 'SG Digital Identity Service Architecture Documentation',
            organisationName: 'Scottish Government',
            search: {
                label: 'Search site',
                indexPath: '/search.json',
                sitemapPath: '/sitemap.html'
            }
        },
        footer: {
            copyright: {
                html: '© <a class="govuk-footer__link" href="https://github.com/ScotAccount/'+ repoName +'/blob/main/LICENSE.md">Crown Copyright (Scottish Government)</a>'
            },
        },
        pathPrefix,
        url,
    }

    eleventyConfig.addPlugin(govukEleventyPlugin, xgovukPluginOptions);

    return {
        pathPrefix,
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        dir: {
            // The folder where all your content will live:
            input: 'app',
            // Use layouts from the x-govuk plugin
            layouts: '../node_modules/@x-govuk/govuk-eleventy-plugin/layouts'
        }
    }
}