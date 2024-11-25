import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/js/Game.js',
    output: {
        file: 'dist/js/bundle.js',
        format: 'iife',
        name: 'Game2048'
    },
    plugins: [nodeResolve()]
};
