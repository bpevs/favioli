import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolveNode from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";

function createConfig(name) {
  return {
    input: `./source/${name}.js`,
    output: {
      file: `./dist/base/${name}.js`,
      format: "iife",
      name: name,
    },
    plugins: [
      json(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      }),
      babel({ exclude: "node_modules/**" }),
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
