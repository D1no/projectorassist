// Rename to config.ts and fill in the correct values.
// Used in shared/types/networkSocketEvents.ts

/**
 * Change to ip address of the server in the network.
 * I.e. http://192.168.1.20 of your local network.
 */
export let SERVER_BASE_URL: string; // = "http://ipaddress";

/**
 * Change to the port the server is running at. Needs to be in sync with `server/deno.jsonc`.
 */
export let SERVER_PORT: number; // = 3001;

/**
 * Location of the slides folder in the assets/public.
 */
export const SLIDES_PUBLIC_FOLDER: string = "/slides/";

/**
 * Must be in the assets/public/slides folder.
 */
export const SLIDES: string[] = [
  "0_alignment_ipad_2022_12inch_portrait.png",
  // "my_slide_01.png",
  // ...
];
