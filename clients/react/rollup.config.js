import typescript from '@rollup/plugin-typescript';


import pkg from './package.json'

export default {
  input: 'index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [typescript({sourceMap: true})],
  external: ['react', 'react-dom'],
}