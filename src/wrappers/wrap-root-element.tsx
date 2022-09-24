import React from "react"
import IdentityProvider from "../context/authContext";
import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo/client";

export default ({ element }) => (
    <ApolloProvider client={client}>
        <IdentityProvider>{element}</IdentityProvider>
    </ApolloProvider>
);