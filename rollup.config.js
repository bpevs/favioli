import commonjs from "rollup-plugin-commonjs";
import resolveNode from "rollup-plugin-node-resolve";

function createConfig(path) {
  return {
    input: `./source${path}`,
    output: {
      file: `./build${path}`,
      format: "iife",
      name: path,
    },
    plugins: [
      commonjs(),
      resolveNode(),
    ],
  };
}

export default [
  createConfig("/background.js"),
];