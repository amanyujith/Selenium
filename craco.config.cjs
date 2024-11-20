module.exports = {
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },

  
  /**to solve axios package issue code start*/
  webpack: {
    configure: (config) => {
        config.resolve = {
          ...config.resolve,
          fallback: {
            ...config.resolve.fallback,
            path: false,
          },
        }
      // ...
      const fileLoaderRule = getFileLoaderRule(config.module.rules)
      if (!fileLoaderRule) {
        throw new Error("File loader not found")
      }
      fileLoaderRule.exclude.push(/\.cjs$/)
      // ...
      return config
    },

    devServer: (devServerConfig) => {
      devServerConfig.hot = false; // Disable hot-reload
      devServerConfig.client = {
        overlay: {
          warnings: false, // Disable warnings overlay
          errors: false,   // Disable errors overlay
        },
      };
      return devServerConfig;
    },
  },
}

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ("oneOf" in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === 'asset/resource') {
      return rule;
    }
  }
  /**Axios package issue code End*/

};