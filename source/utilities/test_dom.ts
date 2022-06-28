import { DOMParser } from 'deno-dom';

globalThis.document = new DOMParser()
  .parseFromString(
    `<!DOCTYPE html><html lang="en"></html>`,
    'text/html',
    // deno-lint-ignore no-explicit-any
  ) as any;
