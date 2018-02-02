import nodeResolve from 'rollup-plugin-node-resolve';

class RollupNG2 {
  constructor(options){
    this.options = options;
  }
  resolveId(id, from){
    if (id.startsWith('rxjs/')){
      return `${__dirname}/../node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
    }
  }
}

const rollupNG2 = (config) => new RollupNG2(config);

export default {
  input: 'dist/aot/app/main-aot.js',
  output: {
    file: 'dist/aot/bundle.es6.js',
    format: 'iife'
  },
  plugins: [
    rollupNG2(),
    nodeResolve({
      jsnext: true,
      main: true,
      modulesOnly: false
    })
  ]
};