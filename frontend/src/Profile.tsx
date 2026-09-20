import React from "react";
import { withAuth } from "react-oidc-context";

class Profile extends React.Component {
  render(): React.ReactNode {
    const auth = this.props.auth;
    return <div>Hello { auth.user?.profile.sub }</div>
  }
}

export default withAuth(Profile);
