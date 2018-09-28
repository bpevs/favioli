import commonjs from "rollup-plugin-commonjs";
import resolveNode from "rollup-plugin-node-resolve";

function createConfig(name) {
  return {
    input: `./source/${name}.js`,
    output: {
      file: `./dist/base/${name}.js`,
      format: "iife",
      name: name,
    },
    plugins: [
      commonjs(),
      resolveNode(),
    ],
  };
}

export default [
  createConfig("background"),
  createConfig("contentScript"),
  createConfig("options"),
];
