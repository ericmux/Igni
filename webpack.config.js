module.exports = {
    entry: "./src/igni.ts",
    output: {
        filename: "igni-full.js",
        path: "./dist",
        publicPath: "/dist/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".ts"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            // All CSS files will be handled by the style-loader/css-loader.
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // All .glsl filels will be handled by the glsl-loader.
            { test: /\.glsl$/, loader: 'webpack-glsl' },
            // This is so the dev server is able to pick up and hot reload changes in the html files.
            // Otherwise, utterly unnecessary.
            { test: /\.html$/, loader: "raw-loader"},
            //  Use image-webpack-loader
            { test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: ['file?hash=sha512&digest=hex&name=images/[hash].[ext]',
                                                          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']}
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};