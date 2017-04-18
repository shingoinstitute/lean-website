module.exports = {

  entry: "./assets/src/app.module.ts",

  output: {
    filename: "bundle.js",
    path: __dirname + "/assets/src/dist"
  },

  resolve: {
    extensions: [".ts"]
  }

};
