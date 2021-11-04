import { Dropbox } from "dropbox";

const dbx = new Dropbox({ fetch: fetch, clientId: "r9btl0edvqqjqo3" });
// To get token by using getAuthenticationUrl.
// Will get location.hash.
// Use queryString to parsel the location.hash to get the token.
export const tokenUrl = dbx.getAuthenticationUrl(
  `http://${window.location.host}/dropbox-auth`
);
