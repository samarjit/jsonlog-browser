import {nodeResolve}  from '@rollup/plugin-node-resolve';
// import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import pluginjson from '@rollup/plugin-json';
// import { terser } from 'rollup-plugin-terser';
export default {
  input: './express-server.js',
  output: {
    file: 'C:\\Users\\samarjit.samanta\\Desktop\\test\\dist\\express-server.js',
    format: 'cjs',
    target: 'node',
  },
  plugins: [
    // nodePolyfills(),
    nodeResolve ({ 
      jsnext: true,
      main: false,
      preferBuiltins: true,
      extensions: ['.js'],
    }), 
    // babel({ 
    //   babelrc: true,
    //   babelHelpers: 'bundled', 
    //   exclude: 'node_modules/**', 
    // }), 
    commonjs({
      include: ['express-server.js', /node_modules/],
    }),
    pluginjson(),
  ],
  
};

// rollup.config.js

// export default [
//   {
//     input: './express-server.js',
//     plugins: [
//       pluginjson(),
//       nodeResolve(),
//       commonjs()
//     ],
//    output: {
//       file: './dist/express-server.js',
//       format: 'cjs'
//     }
//   }
// ];