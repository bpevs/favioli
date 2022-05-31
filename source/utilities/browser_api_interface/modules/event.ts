// deno-lint-ignore-file no-explicit-any

import type { RequestFilter } from './web_request.ts';

export type Function = (...args: any[]) => any | void;

export interface UrlFilter {
  schemes?: string[] | undefined;
  urlMatches?: string | undefined;
  pathContains?: string | undefined;
  hostSuffix?: string | undefined;
  hostPrefix?: string | undefined;
  hostContains?: string | undefined;
  urlContains?: string | undefined;
  querySuffix?: string | undefined;
  urlPrefix?: string | undefined;
  hostEquals?: string | undefined;
  urlEquals?: string | undefined;
  queryContains?: string | undefined;
  pathPrefix?: string | undefined;
  pathEquals?: string | undefined;
  pathSuffix?: string | undefined;
  queryEquals?: string | undefined;
  queryPrefix?: string | undefined;
  urlSuffix?: string | undefined;
  ports?: (number | number[])[] | undefined;
  originAndPathMatches?: string | undefined;
}

export interface BaseEvent<T extends Function> {
  addListener(callback: T, filter?: RequestFilter): void;
  getRules(callback: (rules: Rule[]) => void): void;
  getRules(ruleIdentifiers: string[], callback: (rules: Rule[]) => void): void;
  hasListener(callback: T): boolean;
  removeRules(ruleIdentifiers?: string[], callback?: () => void): void;
  removeRules(callback?: () => void): void;
  addRules(rules: Rule[], callback?: (rules: Rule[]) => void): void;
  removeListener(callback: T): void;
  hasListeners(): boolean;
}

export interface Event<T extends Function> extends BaseEvent<T> {
  addListener(callback: T): void;
}
export interface EventWithRequiredFilterInAddListener<T extends Function>
  extends BaseEvent<T> {
  addListener(callback: T, filter: RequestFilter): void;
}

export interface Rule {
  priority?: number | undefined;
  conditions: any[];
  id?: string | undefined;
  actions: any[];
  tags?: string[] | undefined;
}
