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

      // https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js#L719
      strict: false,
    },
    plugins: [
      json(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      }),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
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
