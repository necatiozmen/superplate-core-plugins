const base = {
    _app: {
        refineImports: [`AuthProvider`],
        top: [
            `
            <Auth0Provider
                domain="your-auth0-domain-address"
                clientId="your-auth0-clientId"
                redirectUri={window.location.origin}
            >
            `,
        ],
        bottom: [
            `</Auth0Provider>`,
        ],
        import: [
            `import axios from "axios";`,
            `import { useAuth0 } from "@auth0/auth0-react";`,
            "",
        ],
        innerHooks: [
            `const { getIdTokenClaims, isLoading, loginWithRedirect, isAuthenticated, user, logout } = useAuth0();`,
        ],
        inner: [
            `
            const authProvider: AuthProvider = {
                login: () => {
                    loginWithRedirect();
                    return Promise.resolve();
                },
                logout: () => {
                    logout({ returnTo: window.location.origin });
                    return Promise.resolve("/");
                },
                checkError: () => Promise.resolve(),
                checkAuth: () => {
                    if (isAuthenticated) {
                        return Promise.resolve();
                    }
        
                    return Promise.reject();
                },
                getPermissions: () => Promise.resolve(),
                getUserIdentity: async () => {
                    if (user) {
                        return Promise.resolve({
                            ...user,
                            avatar: user.picture,
                        });
                    }
                    return Promise.reject();
                },
            };`,
            `
            getIdTokenClaims().then((token) => {
                if (token) {
                    axios.defaults.headers.common = {`,
            "Authorization: `Bearer ${token.__raw}`",
            `};}});`,
            `
            if (isLoading) {
                return <span>Loading...</span>;
            }
            `,
        ],
        refineProps: ["authProvider={authProvider}"],
    },
};
module.exports = {
    extend() {
        return base;
    },
};
