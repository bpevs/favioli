interface Permissions {
  permissions?: string[];
  origins?: string[];
}

export interface PermissionsModule {
  contains: (
    permissions: Permissions,
    callback: (result: boolean) => void,
  ) => void;
  request: (
    permissions: Permissions,
    callback?: (granted: boolean) => void,
  ) => void;
  getAll: (callback: (permissions: Permissions) => void) => void;
  remove: (
    permissions: Permissions,
    callback?: (removed: boolean) => void,
  ) => void;
  onRemoved: {
    addListener: (callback: (permissions: Permissions) => void) => void;
  };
  onAdded: {
    addListener: (callback: (permissions: Permissions) => void) => void;
  };
}
