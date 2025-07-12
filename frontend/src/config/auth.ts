export const AwsConfigAuth = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AUTH_REGION as string,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID as string,
      authenticationFlowType: "USER_PASSWORD_AUTH",
      cookieStorage: {
        domain: import.meta.env.VITE_AUTH_COOKIE_STORAGE_DOMAIN as string,
        path: "/",
        expires: 365,
        sameSite: "strict",
        secure: true,
      },
    }
  }
}

console.log(AwsConfigAuth)
