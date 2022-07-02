/* @jsx h */
import { Fragment, h, VNode } from 'preact';

export interface SwitchProps {
  value?: string;
  defaultCase: VNode | string | null;
  cases: { [name: string]: VNode | string | null };
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
