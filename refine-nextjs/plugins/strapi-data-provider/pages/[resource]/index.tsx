import { GetServerSideProps } from "next";
export { NextRouteComponent as default } from "@pankod/refine-nextjs-router";
import { checkAuthentication } from "@pankod/refine-nextjs-router";
import { DataProvider } from "@pankod/refine-strapi";

import axios from "axios";
import nookies from "nookies";

<%_ if (i18n !== 'no') { _%>
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
<%_ } _%>

import { API_URL, TOKEN_KEY } from "src/constants";
import strapiAuthProvider from "src/authProvider";

const axiosInstance = axios.create();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authProvider } = strapiAuthProvider(API_URL);
  const { isAuthenticated, ...props } = await checkAuthentication(
    authProvider,
    context
  );

  <%_ if (i18n !== 'no') { _%>
    const i18nProps = (await serverSideTranslations(context.locale ?? "en", ["common"]))

    if (!isAuthenticated) {
        return { props: { ...props, ...i18nProps } };
    }

    <%_ } else { _%>
    if (!isAuthenticated) {
      return props;
    }
    
    <%_ } _%>

    const { query } = context;

   try {
        const cookies = nookies.get(context);
        if (cookies[TOKEN_KEY]) {
          axiosInstance.defaults.headers = {
              Authorization: `Bearer ${cookies[TOKEN_KEY]}`,
          };
        }

        const data = await DataProvider(API_URL, axiosInstance).getList({
            resource: query["resource"] as string,
        });

        return {
            props: {
                initialData: data,
                <%_ if(i18n !== 'no') { _%>
                ...i18nProps
    <%_ } _%>
            },
        };
    } catch (error) {
        return { props: {
            <%_ if(i18n !== 'no') { _%>
                ...i18nProps
            <%_ } _%>
        } };
    }
};
