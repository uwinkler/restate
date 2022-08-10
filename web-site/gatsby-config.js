module.exports = {
  siteMetadata: {
    title: `restate documentation`,
    siteUrl: `https://restate.netlify.com`
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    `gatsby-plugin-mdx`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: 'UA-140616243-1'
    //   }
    // },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/icons/icon-512x512.png`,
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`
      }
    },
    `gatsby-plugin-offline`
  ]
}
