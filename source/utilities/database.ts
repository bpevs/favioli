/**
 * Local Icon Database
 * Used to store favicons for later usage.
 */

export interface Favicon {
  id: string; // ID representing favicon (nickname, etc)
  video?: string; // Priority 1: Optional multiframe favicon
  image?: string; // Priority 2: Optional singleframe favicon
  emoji?: string; // Priority 3: Optional emoji favicon
}

/**
 * Video, Image, Emoji are all pointers to source
 * This is so we can point multiple ids to the same data
 */
export interface Source {
  id: string; // Generated by DB
  data: string; // emoji string or base64 image
}