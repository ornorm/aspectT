import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts', // Adjust the entry point as needed
  output: {
    file: 'dist/bundle.js',
    format: 'cjs', // CommonJS format
    sourcemap: true
  },
  external: [
    'ts-morph',
    'fs',
    'path',
    'triple-beam',
    'winston',
    'process',
    'buffer',
    'child_process',
    'events',
    'os',
    'stream',
    'util',
    'net'
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    terser() // Optional: Minify the output
  ]
};
