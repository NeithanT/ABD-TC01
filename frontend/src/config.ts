import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export userManager = new UserManager({
  authority: ,
  client_id: ,
  redirect_uri: ,
  post_logout_redirect_uri: ,
  userStore: ,
  monitorSession: true
});

export const onSigningCallBack() => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
