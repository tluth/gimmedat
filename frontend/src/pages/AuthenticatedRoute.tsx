import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { route } = useAuthenticator((context) => [context.route]);

  if (route !== "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
