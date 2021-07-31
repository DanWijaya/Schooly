import { Dropbox } from "dropbox";

const dbx = new Dropbox({ fetch: fetch, clientId: "r9btl0edvqqjqo3" });
// to get token by using getAuthenticationUrl
// we will get location.hash
// use queryString to parsel the location.hash to get the token;p
export const tokenUrl = dbx.getAuthenticationUrl(
  `http://${window.location.host}/dropbox-auth`
);
