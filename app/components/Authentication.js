import React, {useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import {login} from '-/graphql/authentication';

export const AuthenticationContext = React.createContext();

export default props => {
    const {children} = props;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginUser] = useMutation(login);

    const signIn = async() => {
        try {
            setIsLoggingIn(true);
            // check that play services exist so login can be attempted
            await GoogleSignin.hasPlayServices();
            // do the signin
            const {accessToken, idToken, user, ...rest} = await GoogleSignin.signIn();
            // get credential so we can validate against firebase
            const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
            // auth against firebase
            await auth().signInWithCredential(credential);
            const {email} = user;
            // send to server to establish session
            await loginUser({variables: {email}});
            // update application state
            setIsLoggedIn(true);
            setUser(user);
            setIsLoggingIn(false);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setIsLoggingIn(false);
                setIsLoggedIn(false);
                setUser(null);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setIsLoggingIn(true);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                setIsLoggingIn(false);
                setIsLoggedIn(false);
                setUser(null);
            }
        }
    };

    const signOut = async() => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            // noop
        }

        setIsLoggedIn(false);
        setUser(null);
    };

    const onAuthStateChanged = async user => {
        if (user) {
            const {email} = user;
            // send to server to establish session
            await loginUser({variables: {email}});

            setUser(user);
            setIsLoggedIn(true);
        }
    };

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['email'],
            webClientId: '355779476097-o2euqmi58qc4br3q7kgon7l9remq5hva.apps.googleusercontent.com',
            offlineAccess: true
        });

        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        return subscriber; // unsubscribe on unmount
    }, []);

    const feelsboxAuth = {
        isLoggedIn,
        isLoggingIn,
        signIn,
        signOut,
        user
    };

    return (
        <AuthenticationContext.Provider value={feelsboxAuth}>{children}</AuthenticationContext.Provider>
    );
};
