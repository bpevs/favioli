export default function Only({
  if: predicate,
  children,
}: {
  if: boolean;
  children: any;
}) {
  return predicate ? children : null;
}
