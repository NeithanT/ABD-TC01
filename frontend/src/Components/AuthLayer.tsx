import type { ReactNode } from "react";
import { withAuthenticationRequired } from "react-oidc-context";

export const AuthLayer = withAuthenticationRequired(
  ({ children }: { children?: ReactNode }) => <>{children}</>,
  {
    OnRedirecting: () => <h1>Loading...</h1>,
  }
);

export default AuthLayer;

