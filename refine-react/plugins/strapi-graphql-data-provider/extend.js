const base = {
    _app: {
        refineImports: [`AuthProvider`],
        refineAntdImports: [],
        import: [
            `import dataProvider from "@pankod/refine-strapi-graphql";`,
            `import { GraphQLClient } from "graphql-request";`,
            "",
            `const API_URL = "https://api.strapi.refine.dev/graphql";`,
            "",
            `const client = new GraphQLClient(API_URL);`,
            `const gqlDataProvider = dataProvider(client);`,
            "",
            "",
            `
            const authProvider: AuthProvider = {
                login: async ({ username, password }) => {
                    try {
                        const { data } = await gqlDataProvider.custom!({
                            url: "",
                            method: "post",
                            metaData: {
                                operation: "login",
                                variables: {
                                    input: {
                                        value: { identifier: username, password },
                                        type: "UsersPermissionsLoginInput",
                                        required: true,
                                    },
                                },
                                fields: ["jwt"],
                            },
                        });
            
                        localStorage.setItem("token", data.jwt);
                        client.setHeader("Authorization", \`Bearer \${data.jwt}\`);
            
                        return Promise.resolve();
                    } catch (error) {
                        return Promise.reject(error);
                    }
                },
                logout: async () => {
                    localStorage.removeItem("token");
                    client.setHeader("Authorization", "");
                    return Promise.resolve("/");
                },
                checkError: () => Promise.resolve(),
                checkAuth: () => {
                    const jwt = localStorage.getItem("token");
            
                    if (!jwt) {
                        return Promise.reject();
                    }
            
                    client.setHeader("Authorization", \`Bearer \${jwt}\`);
            
                    return Promise.resolve();
                },
                getPermissions: async () => {
                    try {
                        const { data } = await gqlDataProvider.custom!({
                            url: "",
                            method: "get",
                            metaData: {
                                operation: "me",
                                fields: [
                                    {
                                        role: ["name", "description", "type"],
                                    },
                                ],
                            },
                        });
                        const { role } = data;
            
                        return Promise.resolve(role);
                    } catch (error) {
                        return Promise.reject(error);
                    }
                },
                getUserIdentity: async () => {
                    try {
                        const { data } = await gqlDataProvider.custom!({
                            url: "",
                            method: "get",
                            metaData: {
                                operation: "me",
                                fields: ["id", "username", "email"],
                            },
                        });
                        const { id, username, email } = data;
                        return Promise.resolve({
                            id,
                            name: username,
                            email,
                        });
                    } catch (error) {
                        return Promise.reject(error);
                    }
                },
            };
            `,
        ],
        refineProps: [
            "dataProvider={gqlDataProvider}",
            "authProvider={authProvider}",
        ],
    },
};
module.exports = {
    extend(answers) {
        if (answers["uiFramework"] === "antd") {
            base._app.refineAntdImports.push("LoginPage");
            base._app.refineProps.push("LoginPage={LoginPage}");
        }
        return base;
    },
};
