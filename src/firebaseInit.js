import firebase from 'firebase/app';
import 'firebase/messaging';
import { API_PATH } from "./utils/const";
import axios, { AxiosRequestConfig } from "axios";

const config = {
    apiKey: "AIzaSyDzef8AiE3Fw8jPGnvJZHEreKYgl4kGWp0",
    authDomain: "aqua-dashboard.firebaseapp.com",
    databaseURL: "https://aqua-dashboard.firebaseio.com",
    projectId: "aqua-dashboard",
    storageBucket: "aqua-dashboard.appspot.com",
    messagingSenderId: "515081409051",
    appId: "1:515081409051:web:e5ecb915c3c9818f405ebe",
    measurementId: "G-RRXEWY2CJD"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

// next block of code goes here

export const getToken = (setTokenFound) => {
return messaging.getToken({vapidKey: 'BNwAxADuq0dpiRcQg2QysgSAt6oynpkPfg_7vYRNify9Hy7p7ynUmvDNXUCLaNjCH5UFiN4MenMxv3GMof39E6g'}).then((currentToken) => {
    if (currentToken) {
    console.log('current token for client: ', currentToken);
    axios.put(API_PATH+'/api/v1/settings/notifications/push-token', 
        { 
            fcm_push_token: currentToken ,
        }, 
        {
        headers: {
            "Content-Type": "application/json",
            "Project-Key": localStorage.getItem("projectKey"),
            Authorization: "Bearer " + localStorage.getItem("token"),
        }
        }
    ).then((res) => {
        console.log("data2",res.data.message)
    }).catch((error) => {
        console.log("ERROR2",error)
    });
    setTokenFound(true);
    // Track the token -> client mapping, by sending to backend server
    // show on the UI that permission is secured

        // this.setState({ name: '', email: '' })
    } else {
    console.log('No registration token available. Request permission to generate one.');
    setTokenFound(false);

    // shows on the UI that permission is required 
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
});
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
        console.log(payload);
    });
  });