import type { Favicon } from '../models/favicon.ts';
import type { Settings } from '../models/settings.ts';
import type Autoselector from './favicon_autoselector.ts';

/**
 * Override Priority
 *
 * 1. Ignore list (always ignore if ignore list enabled)
 * 2. Site list (if matched in site list, user manually added)
 * 3. Autofill (if autofill is enabled)
 * 4. Ignore (autofill NOT enabled, user hasn't added to sitelist)
 */
export default function selectFavicon(
  url: string,
  settings: Settings,
  autoselector?: Autoselector,
): [Favicon | void, boolean] {
  const { ignoreList, siteList, features } = settings;
  if (features.enableSiteIgnore && ignoreList.some(listItemMatchesURL(url))) {
    return [undefined, false];
  }

  const firstMatchingFavicon = siteList.filter(listItemMatchesURL(url))?.[0];
  if (firstMatchingFavicon) return [firstMatchingFavicon, true];

  return autoselector && features.enableFaviconAutofill
    ? [autoselector.selectFavicon(url), Boolean(features.enableOverrideAll)]
    : [undefined, false];
}

function listItemMatchesURL(url: string): (favicon: Favicon) => boolean {
  return (favicon: Favicon): boolean =>
    favicon?.matcher ? new RegExp(favicon.matcher || '^$').test(url) : false;
}
