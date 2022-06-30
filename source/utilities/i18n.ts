const broadPermissionsWarning = `\
This feature requires you give Favioli the ability to view and modify all websites you visit.
This permission is used to:

1. Determine if a website has a favicon.
2. Select a favicon based on the website url.
3. Modify a website and add a favicon.

Favioli does NOT collect or store any of this data, and does NOT use these permissions for anything besides what is stated here.`;

const en: { [name: string]: string } = {
  enableOverrideAllLabel: 'Override All Favicons',
  enableOverrideIndicatorLabel: 'Indicate Overridden Favicons',
  enableFaviconAutofillDesc:
    'If a website doesn\'t have a favicon, Favioli will automatically create one for it using an emoji.',
  enableFaviconAutofillLabel: 'Enable Autofill',
  enableFaviconAutofillPopup: broadPermissionsWarning,
  enableSiteIgnoreDesc: 'Select sites that autofill should ignore',
  enableSiteIgnoreLabel: 'Enable Ignore List',
  faviconListTitle: 'Override Favicons on these Sites',
  ignoreListTitle: 'Ignore These Sites',
  saveLabel: 'Save',
};

export function t(id: string): string {
  if (!id) {
    console.warn(`Invalid string id: ${id}`);
  }
  return en[id] || '';
}
