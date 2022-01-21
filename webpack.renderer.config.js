const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push({
    test: /\.css$/,
    use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                },
            },
        },
    ],
});

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    },
    target: "electron-renderer",
};
