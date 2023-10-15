import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { firebaseConfig } from "../utils/constants";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

let messaging;

if (typeof window !== "undefined") {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;
  try {
    currentToken = await messaging.getToken({
      vapidKey:
        "BJX9RVpiiCkm4zBPqQWKP8DtqM4XD1vo0qAjHxNm103FYtoRYaVehWJjo1EeT6h6dahcdjkQphi6mlSqRDVO3BA",
    });
    console.log("FCM registration token", currentToken);
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
