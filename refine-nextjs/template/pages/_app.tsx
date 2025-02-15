import React from "react";
import { AppProps } from "next/app";

import { Refine, <%- (_app.refineImports || []).join("\n,") _%> } from '@pankod/refine-core';
<%_ if (answers.uiFramework === 'antd') { _%>
    import { <%- (_app.refineAntdImports || []).join("\n,") _%> } from '@pankod/refine-antd';
<%_ } _%>
import routerProvider from "@pankod/refine-nextjs-router";

<%- (_app.import || []).join("\n") _%>

<%
    var top = _app.wrapper.map(wrapper => wrapper[0] || "");
    var bottom = _app.wrapper.map(wrapper => wrapper[1] || "").reverse();
%>

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    <%- (_app.innerHooks || []).join("\n") %>
    <%- (_app.inner || []).join("\n") %>
    return (
        <%- top.join("\n") %>
        <Refine 
            routerProvider={routerProvider}
            <%- (_app.refineProps || []).join("\n") %>
        >
            <Component {...pageProps} />
        </Refine>
        <%- bottom.join("\n") %>
      );
};


<%_ if (i18n !== 'no') { _%>
export default appWithTranslation(MyApp);
<%_ } else {_%>
export default MyApp;
<%_ } _%>
