import React, { createContext, useEffect, useState } from 'react';
import * as netlifyIdentity from 'netlify-identity-widget';

interface InitialState {
    identity: any,
    user: netlifyIdentity.User | null
}

export const IndentityContext = createContext<InitialState>({
    identity: null,
    user: null,
})

const IndentityProvider = (props) => {
    const [user, setUser] = useState<netlifyIdentity.User | null>(null);

    useEffect(() => {
        netlifyIdentity.init();
    }, []);

    netlifyIdentity.on("login", (user) => {
        netlifyIdentity.close();
        setUser(user);
    });

    netlifyIdentity.on("logout", () => {
        netlifyIdentity.close();
        setUser(null);
    });

    return(  
        <IndentityContext.Provider value={{ identity: netlifyIdentity, user: user }}>
            {props.children}
        </IndentityContext.Provider>
    );
}

export default IndentityProvider;