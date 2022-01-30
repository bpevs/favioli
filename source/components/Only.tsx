/* @jsx h */

import { h, VNode } from "preact";

export interface OnlyProps {
  if: boolean;
  // deno-lint-ignore no-explicit-any
  children: VNode<any>;
}

export default function Only({ if: predicate, children }: OnlyProps) {
  return predicate ? children : null;
}
