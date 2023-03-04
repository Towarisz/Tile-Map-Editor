const path = require("path");
module.exports = {
     watch: true,
     entry: {
          index: "./index.ts",
     },
     output: {
          path: path.resolve(__dirname, "./public"),
          filename: "[name].bundle.js",
     },
     module: {
          rules: [
               {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
               },
          ],
     },
     resolve: {
          extensions: [".tsx", ".ts", ".js"],
     },
};
