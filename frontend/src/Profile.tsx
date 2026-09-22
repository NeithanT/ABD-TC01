import React from "react";
import { withAuth } from "react-oidc-context";
import type { AuthContextProps } from "react-oidc-context";

interface ProfileProps {
  auth: AuthContextProps;
}

class Profile extends React.Component<ProfileProps> {
  render(): React.ReactNode {
    const auth = this.props.auth;
    return <div>Hello { auth.user?.profile.sub }</div>;
  }
}

export default withAuth(Profile);

