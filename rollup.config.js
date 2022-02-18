import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';
import dts from 'rollup-plugin-dts';
import del from "rollup-plugin-delete";

const input = './src/index.js';
const external = id => !id.startsWith('.') && !id.startsWith('/');

const globals = {
  react: 'React',
  'prop-types': 'PropTypes',
};

const getBabelOptions = ({ useESModules }) => ({
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  plugins: [['@babel/transform-runtime', { useESModules }]],
});

export default [
  {
    input,
    output: {
      file: 'dist/react-event-listener.umd.js',
      format: 'umd',
      exports: 'named',
      name: 'ReactEventListener',
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(getBabelOptions({ useESModules: true })),
      commonjs({ include: '**/node_modules/**' }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    ],
  },
  {
    input,
    output: { file: pkg.main, format: 'cjs', exports: 'named' },
    external,
    plugins: [babel(getBabelOptions({ useESModules: false }))],
  },
  {
    input,
    output: { file: 'dist/react-event-listener.esm.js', format: 'es', exports: 'named' },
    external,
    plugins: [babel(getBabelOptions({ useESModules: true }))],
  },
  {
    input: './index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
        dts(),
        del({ hook: "buildEnd", targets: "./dist/dts" }), //<------ New Addition
    ],
},
];
