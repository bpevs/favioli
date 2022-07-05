import type { Settings } from '../../models/settings.ts';

import { assertStrictEquals } from 'std/asserts';
import { describe, it } from 'std/bdd';

import { DEFAULT_SETTINGS } from '../../models/settings.ts';
import Autoselector, { AUTOSELECTOR_VERSION } from '../favicon_autoselector.ts';
import selectFavicon from '../favicon_selector.ts';

const url = 'https://fAvIolI.cOm';
const emojiId = 'tractor';

describe('matchers', () => {
  const settings: Settings = { ...DEFAULT_SETTINGS };

  it('Should match strings, ignoring case', () => {
    settings.siteList = [{ matcher: 'fAvIolI.cOm', emojiId }];
    const [favicon, shouldOverride] = selectFavicon(url, settings);
    assertStrictEquals(shouldOverride, true);
    assertStrictEquals(favicon?.emojiId, 'tractor');
    assertStrictEquals(favicon?.matcher, 'fAvIolI.cOm');
  });

  it('Should match regex', () => {
    settings.siteList = [{ matcher: '/favi/i', emojiId }];
    const matchedFavicon = selectFavicon(url, settings)[0];

    settings.siteList = [{ matcher: '/favi/', emojiId }];
    const noMatchFavicon = selectFavicon(url, settings)[0];

    assertStrictEquals(matchedFavicon?.emojiId, 'tractor');
    assertStrictEquals(matchedFavicon?.matcher, '/favi/i');
    assertStrictEquals(noMatchFavicon, undefined);
  });

  it('Should return [undefined, false] if no matches', () => {
    settings.siteList = [];
    const [favicon, shouldOverride] = selectFavicon(url, settings);

    assertStrictEquals(favicon, undefined);
    assertStrictEquals(shouldOverride, false);
  });

  it('Should return [undefined, false] if site is ignored', () => {
    const favicon = { matcher: 'fAvIolI.cOm', emojiId };
    settings.siteList = [favicon];
    settings.ignoreList = [favicon];
    settings.features.enableSiteIgnore = false;
    const matchedFavicon = selectFavicon(url, settings)[0];

    settings.features.enableSiteIgnore = true;
    const noMatchFavicon = selectFavicon(url, settings)[0];

    assertStrictEquals(matchedFavicon, favicon);
    assertStrictEquals(noMatchFavicon, undefined);
  });
});

describe('autoselect', () => {
  const autoselect = new Autoselector(AUTOSELECTOR_VERSION.UNICODE_11);
  const settings: Settings = { ...DEFAULT_SETTINGS };

  it('Should not autoselect if no autoselect enabled', () => {
    settings.features.enableFaviconAutofill = false;
    const [favicon, shouldOverride] = selectFavicon(url, settings, autoselect);

    assertStrictEquals(favicon, undefined);
    assertStrictEquals(shouldOverride, false);
  });

  it('Should autoselect if autoselect is enabled', () => {
    settings.features.enableFaviconAutofill = true;
    const [favicon, shouldOverride] = selectFavicon(url, settings, autoselect);

    assertStrictEquals(favicon?.emojiId, 'mouth');
    assertStrictEquals(favicon?.matcher, 'https://fAvIolI.cOm');
    assertStrictEquals(shouldOverride, false);
  });

  it('Should override if overrideAll is enabled', () => {
    settings.features.enableFaviconAutofill = true;
    settings.features.enableOverrideAll = true;
    const [favicon, shouldOverride] = selectFavicon(url, settings, autoselect);

    assertStrictEquals(favicon?.emojiId, 'mouth');
    assertStrictEquals(favicon?.matcher, 'https://fAvIolI.cOm');
    assertStrictEquals(shouldOverride, true);
  });
});
