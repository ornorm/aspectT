import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'bin/printf_cli/index.ts',
  output: {
    file: 'dist/printf_cli/index.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: 'bin/printf_cli/tsconfig.json'
    }),
    terser()
  ],
  external: [
    'inquirer',
    'reflect-metadata',
    'shelljs',
    'ts-morph'
  ]
};
