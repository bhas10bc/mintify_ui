import { BASE_URL } from "../Common/DataConst";

export const TEST_DEV = BASE_URL;

export const URI_PREFIX = TEST_DEV;
export function getHost() {
  return URI_PREFIX;
}
export var URI = getURI();
export function getURI() {
  return {
    createWallet: `${getHost()}/create-account`,
    activateAccount: `${getHost()}/activate-account`,
    createToken: `${getHost()}/create-token`,
    getAssets: `${getHost()}/get-assets`,
  };
}
