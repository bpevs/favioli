/* @jsx h */
import { Fragment, h, VNode } from 'preact';

export interface OnlyProps {
  if: boolean;
  children: VNode | string | (VNode | string)[];
}

export default function Only({ if: predicate, children }: OnlyProps) {
  return (
    <Fragment>
      {predicate ? children : null}
    </Fragment>
  );
}
