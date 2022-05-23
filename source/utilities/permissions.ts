// https://developer.chrome.com/docs/extensions/reference/permissions/
import browserAPI from './browserAPI.ts';
const { contains, request } = browserAPI.permissions;

const permissions = ['tabs'];
const allOrigins = ['https://*/*', 'http://*/*'];

export function requestPermissionToSites(origins: string[]): Promise<boolean> {
  return requestPermission({ permissions, origins });
}

export function requestPermissionToAllSites(): Promise<boolean> {
  return requestPermission({ permissions, origins: allOrigins });
}

/**
 * @return Promise boolean
 *    true - user has granted permission (now or previously)
 *    false - user has not grated permission
 */
async function requestPermission(args: {
  permissions: string[];
  origins: string[];
}): Promise<boolean> {
  const userAlreadyHasPermission =
    await (new Promise((resolve) =>
      contains(args, (result: boolean) => resolve(result))
    ));

  if (userAlreadyHasPermission) return true;

  return new Promise((resolve) => {
    return request(args, (granted: boolean) => resolve(granted));
  });
}
