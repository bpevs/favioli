/* @jsx h */
import { Fragment, h, VNode } from 'preact';

export interface SwitchProps {
  value?: string;
  // deno-lint-ignore no-explicit-any
  defaultCase: VNode<any> | null;
  // deno-lint-ignore no-explicit-any
  cases: { [name: string]: VNode<any> };
}

export default function Switch(
  { value, defaultCase = null, cases }: SwitchProps,
) {
  if (value == null) return null;
  return (
    <Fragment>
      {cases[value] != null ? cases[value] : defaultCase}
    </Fragment>
  );
}
