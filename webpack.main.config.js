const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: "./src/main.ts",
    // Put your normal webpack config below here
    module: {
        rules: require("./webpack.rules"),
    },
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "/assets"),
                    to: path.join(__dirname, ".webpack/main/assets"),
                },
            ],
        }),
    ],
};
