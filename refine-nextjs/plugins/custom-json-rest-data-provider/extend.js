const base = {
    _app: {
        import: [
            `import dataProvider from "@pankod/refine-simple-rest";`,
            `const API_URL = "https://api.fake-rest.refine.dev";`,
            "",
        ],
        refineProps: ["dataProvider={dataProvider(API_URL)}"],
    },
};

module.exports = {
    extend() {
        return base;
    },
};
