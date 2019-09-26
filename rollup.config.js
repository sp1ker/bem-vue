import * as path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

const builds = {
  'cjs-dev': {
    outFile: 'bem-vue.js',
    format: 'cjs',
    mode: 'development',
  },
  'cjs-prod': {
    outFile: 'bem-vue.min.js',
    format: 'cjs',
    mode: 'production',
  },
  'umd-dev': {
    outFile: 'bem-vue.umd.js',
    format: 'umd',
    mode: 'development',
  },
  'umd-prod': {
    outFile: 'bem-vue.umd.min.js',
    format: 'umd',
    mode: 'production',
  },
  es: {
    outFile: 'bem-vue.module.js',
    format: 'es',
    mode: 'development',
  },
};

function getAllBuilds() {
  return Object.keys(builds).map(key => genConfig(builds[key]));
}

function genConfig({ outFile, format, mode }) {
  const isProd = mode === 'production';
  return {
    input: './src/index.ts',
    output: {
      file: path.join('./lib', outFile),
      format: format,
      globals: {
        vue: 'Vue',
      },
      name: format === 'umd' ? 'bem-vue' : undefined,
    },
    external: ['vue'],
    plugins: [
      typescript({
        typescript: require('typescript'),
    }),
  nodeResolve({
    jsnext: true,
    main: true
  }),
  commonjs({
    namedExports: {
      '@bem-react/classname': [ 'cn', 'withNaming' ]
    }
  }),
  resolve(),
      replace({ 'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development') }),
      isProd && terser(),
    ].filter(Boolean),
  };
}

let buildConfig;

if (process.env.TARGET) {
  buildConfig = genConfig(builds[process.env.TARGET]);
} else {
  buildConfig = getAllBuilds();
}

export default buildConfig;
