import path from "path";
import esbuild from 'rollup-plugin-esbuild'
// import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/soursop.cjs.js',
      format: 'cjs',
      exports: 'named',
      esModule: true,
    },
    plugins: [
      // typescript()
      esbuild({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        target: 'es2019',
      })
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/soursop.iife.js',
      format: 'iife',
      name: 'soursop',
      exports: 'named',
    },
    plugins: [
      // typescript()
      esbuild({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        target: 'es2019',
      })
    ],
  }
];
