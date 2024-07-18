import { customerQueries } from "@/apis/queries";
import { userAtom, userAuthLoading } from "@/atoms/auth";
import { USER_ID } from "@/constants";
import analyticService from "@/services/analyticService";
import { UserDetails } from "@/types/userDetails";
import { attachUserToClarity } from "@/utils/analytics";
import useUserData, { IGuestUserAddress } from "@/utils/hooks/useUserData";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/nextjs";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import { userAccessTokenAtom } from "@/features/Authentication/atom/userAccessToken";
import { useFirebaseAuth } from "@/features/Authentication/hooks/useFirebaseAuth";
import { clubApparelAtom } from "@/features/CA/atoms/clubApparelAtom";

import { useCookies } from "./cookies";

export const FirebaseAuthContext =
  React.createContext<FirebaseAuthProps | null>(null);

export interface FirebaseAuthProps {
  uid: string;
  email: string;
}

export default function FirebaseAuthProvider({ children }) {
  const router = useRouter();
  const { app } = useFirebaseAuth();
  const cookies = useCookies();

  const [authUser, setAuthUser] = useState<FirebaseAuthProps>(null);
  const setIsUserAuthLoading = useSetAtom(userAuthLoading);
  const [userDetails, setUserDetails] = useAtom(userAtom);
  const setClubApparel = useSetAtom(clubApparelAtom);
  const { getFormatedAddress } = useUserData();
  const customerAccessToken = useAtomValue(userAccessTokenAtom);

  const formatAuthUser = (user: FirebaseAuthProps) => ({
    uid: user.uid,
    email: user.email,
  });

  const {
    data: { customer: { defaultAddress } } = {
      customer: { defaultAddress: null },
    },
  } = useQuery<{
    customer: { defaultAddress: IGuestUserAddress };
  }>(customerQueries.GET_CUSTOMER_DEFAULT_ADDRESS, {
    variables: { customerAccessToken },
    skip: !customerAccessToken,
  });

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      analyticService.auth.trackUserData(userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    setIsUserAuthLoading(true);
    const unsubscribe = onIdTokenChanged(getAuth(app), (authState) => {
      if (!authState) {
        setAuthUser(null);
        setIsUserAuthLoading(false);
        if (router.pathname.includes("/account")) {
          router.replace(
            "/auth/sign-in?return-url=" + encodeURIComponent(router.pathname),
          );
        }
        return;
      }
      const formattedUser = formatAuthUser(authState);
      setAuthUser(formattedUser);
      setIsUserAuthLoading(false);
      // attach user id with sentry sessions
      Sentry.setUser({ id: formattedUser.uid });

      // attach user id with microsoft clarity sessions
      attachUserToClarity(formattedUser.uid);

      cookies.set(USER_ID, formattedUser.uid, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
    });

    if (process.env.NODE_ENV === "production") {
      getAnalytics(app);
      getPerformance(app);
    }

    return () => unsubscribe();
  }, [app]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        onAuthStateChanged(getAuth(app), async (user) => {
          if (user) {
            const userId = user.uid;
            const firestore = getFirestore(app);
            const userRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) return;

            if (userDoc.exists()) {
              const data = userDoc.data() as UserDetails;
              data.dob = data["dob"]
                ? new Date(data["dob"]["seconds"] * 1000).toLocaleDateString(
                    "en-US",
                  )
                : "";
              setClubApparel(data.clubApparel);
              setUserDetails((prev) => ({ ...prev, ...data }));
            } else {
              console.log("No such document!");
            }
          } else {
            console.log("User is not signed in.");
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (authUser) {
      getUserDetails();
    }
  }, [authUser]);

  useEffect(() => {
    if (defaultAddress) {
      const userAddress = getFormatedAddress(defaultAddress);
      setUserDetails((prev) => ({ ...prev, address: userAddress }));
    }
  }, [defaultAddress]);

  return (
    <FirebaseAuthContext.Provider value={authUser}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export const useFirebaseAuthContext = () => useContext(FirebaseAuthContext);
