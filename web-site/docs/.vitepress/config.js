export default {
  title: 'Restate',
  description: 'ReState is a predictable, easy to use, easy to integrate, typesafe state container for React',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    siteTitle: false,
    nav: [
      { text: 'Docs', link: '/guide/hello-world' },
      { text: 'API', link: '/api' },
      { text: 'Tutorial', link: '/tutorial' },
      { text: 'Imprint', link: '/imprint' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Dr. Winkler GmbH'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/uwinkler/restate' }],
    sidebar: {
      '/guide/': [
        {
          text: 'Docs',
          items: [
            { text: 'Hello Restate', link: 'hello-world' },
            { text: 'Installation', link: '/installation' },
            { text: 'Store', link: '/quick-store' },
            { text: 'Provider', link: '/quick-provider' },
            { text: 'App State Hook', link: '/quick-state-hook' },
            { text: 'Next Hook', link: '/quick-next-hook' },
            { text: 'Actions', link: '/quick-actions' },
            { text: 'Connectors', link: '/quick-glue' },
            { text: 'Middleware', link: '/quick-middleware' },
            { text: 'DevTools', link: '/quick-dev-tools' }
          ]
        }
      ],
      '/tutorial': [
        {
          text: 'Tutorial',
          items: [
            { text: 'Hello Restate', link: 'hello-world' },
            { text: 'Installation', link: '/installation' },
            { text: 'Store', link: '/quick-store' },
            { text: 'Provider', link: '/quick-provider' },
            { text: 'App State Hook', link: '/quick-state-hook' },
            { text: 'Next Hook', link: '/quick-next-hook' },
            { text: 'Actions', link: '/quick-actions' },
            { text: 'Connectors', link: '/quick-glue' },
            { text: 'Middleware', link: '/quick-middleware' },
            { text: 'DevTools', link: '/quick-dev-tools' }
          ]
        }
      ]
    }
  }
}
