import path from "path";
import esbuild from 'rollup-plugin-esbuild'
import dts from "rollup-plugin-dts"
// import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es"
    },
    plugins: [dts()],
  },
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
        tsconfig: path.join('.', '/tsconfig.json'),
        target: 'es2019',
      })
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/soursop.esm.js',
      format: 'es',
      exports: 'named',
    },
    plugins: [
      // typescript()
      esbuild({
        tsconfig: path.join('.', '/tsconfig.json'),
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
        tsconfig: path.join('.', '/tsconfig.json'),
        target: 'es2019',
      })
    ],
  }
];
