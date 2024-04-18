module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/plugin-transform-modules-commonjs',
        '@babel/preset-react',
        '@babel/preset-flow',
    ]
};