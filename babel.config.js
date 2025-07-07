const { resolve } = require('path');

module.exports = function (api) {
  api.cache(true); // Cache for performance
  return {
    presets: ['babel-preset-expo'], // Use Expo's Babel preset

    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@@': resolve(__dirname, 'src'), // Alias for the 'src' directory
            '@assets': resolve(__dirname, 'assets'), // Alias for the 'assets' directory
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.svg', // Existing supported extensions
            '.png',
            '.jpg',
            '.jpeg', // Add image extensions
          ],
        },
      ],
    ],
  };
};
