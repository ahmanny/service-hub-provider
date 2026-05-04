const appJson = require("./app.json");

const mapboxToken =
  process.env.EXPO_PUBLIC_MAPBOX_KEY ||
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
  "";

const expo = {
  ...appJson.expo,
  plugins: appJson.expo.plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "@rnmapbox/maps") {
      return [
        "@rnmapbox/maps",
        {
          ...plugin[1],
          accessToken: mapboxToken,
        },
      ];
    }

    return plugin;
  }),
};

module.exports = { expo };
