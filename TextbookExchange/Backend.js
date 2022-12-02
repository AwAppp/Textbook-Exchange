/*  This module implements the class Backend from the class diagram
    It basically handle the interaction with the database
    for example, sign up a new user, update user information etc
*/

import { initializeApp } from 'firebase/app';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

import {
    getFirestore,
    collection, setDoc, doc, getDoc, updateDoc, addDoc,
    getDocs, query, where, deleteDoc, arrayUnion, increment, onSnapshot
} from "firebase/firestore";

import {
    getStorage,
    ref, uploadBytes, uploadString, getDownloadURL, connectStorageEmulator
} from "firebase/storage";
import { Message_parse } from "./models/message.js";



// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPXF-1VTA6-O76lVI3T6Tws894coJ2xrQ",
    authDomain: "bookschange-d09eb.firebaseapp.com",
    projectId: "bookschange-d09eb",
    storageBucket: "bookschange-d09eb.appspot.com",
    messagingSenderId: "1065896407600",
    appId: "1:1065896407600:web:acc6efc17988f7bb8cb3f5",
    measurementId: "G-TWVJVKK33M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// class Backend - corresponding to the Backend class
// in our class diagram
class Backend {
    #userDataBase;
    #authenticationService;
    #storage;


    constructor() {
        this.#authenticationService = getAuth(app);
        this.#userDataBase = getFirestore(app);
        this.#storage = getStorage(app);
    }

    getDB() {
        return this.#userDataBase;
    }

    // current user info:
    // return value: email of the current user
    getCurrentUserId() {
        return this.#authenticationService.currentUser.uid;
    }

    // returns collection for a specified collection name
    getCollection(collection_name) {
        return collection(this.#userDataBase, collection_name);
    }
    getDB() {
        return this.#userDataBase;
    }

    // signUp - an async function to try to sign up an account using auth service
    // parameter:   email: String
    //              password: String
    // return value:    uid of the user which has been signed up
    //                  return null when fail to sign up
    async signUp(email, password) {
        try {
            let userCredential = await createUserWithEmailAndPassword(
                this.#authenticationService,
                email,
                password
            );
            const user = userCredential.user;

            const docRef = await setDoc(
                doc(
                    this.#userDataBase,
                    "users",
                    user.uid
                ),
                {
                    "email": email,
                    "uid": user.uid
                }
            );

            return user.uid;
        }
        catch (error) {
            return error;
        }
    }

    // signIn - an async function to try to sign in an account using auth service
    // parameters:  email: String
    //              password: String
    // return value:    uid of the user which has been signed in
    //                  return null when fail to sign in
    async signIn(email, password) {
        try {
            let userCredential = await signInWithEmailAndPassword(
                this.#authenticationService,
                email,
                password
            );
            const user = userCredential.user;
            return user.uid;
        } catch (error) {
            return error;
        }
    }

    // getUserInfo - an async function to get user information from database
    // it first try to call sign in function to get uid
    // and use that uid to get user information from the database
    // parameters:  username: String
    //              password: String
    // return value:    an object include the information of the user
    //                  return null when fail to get user information
    async getUserInfo(username, password) {
        const uid = await this.signIn(username, password);

        const docRef = doc(this.#userDataBase, "users", String(uid));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());

            return docSnap.data();
        } else {
            return { "error_message": "No such document" };
        }
    }

    // getUserInfoByUid - an async function to get user information from firestor
    // by the uid
    // parameters:  uid  : String
    // return value:    an object include the information from firestore
    async getUserInfoByUid(uid) {
        const docRef = doc(this.#userDataBase, "users", String(uid));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());

            return docSnap.data();
        } else {
            return { "error_message": "No such document" };
        }
    }

    async listenUserInfoByUID(uid, callback) {
        const unsub = onSnapshot(doc(this.#userDataBase, "users", String(uid)), (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            }
        });

        return unsub;
    }

    // addUser - an sync function to try to add information of a new user
    // into database
    // parameters:  user: User object (or any object with a uid field)
    // return value:    true on success
    //                  false on fail
    async addUser(user) {
        try {
            await setDoc(doc(this.#userDataBase,
                "users", String(user.uid)),
                user
            );

            return true;
        } catch (error) {
            return error;
        }
    }

    // updateUser - an async function to try to update information of
    // an existing user in the database
    // parameters:  user: User object (or any object with a uid field)
    // return value:    true on success
    //                  false on fail 
    async updateUser(user) {
        try {
            const userRef = doc(this.#userDataBase, "users", String(user.uid));

            // Set the "capital" field of the city 'DC'
            await updateDoc(userRef, user);
            return true;
        }
        catch (error) {
            return error;
        }
    }

    // addPost - an async function used to try to add a new post
    // into the database
    // parameters:  Post object (or any object with post_id field)
    // return value:    post_id on success
    //                  error object on fail
    async addPost(post) {
        try {
            const docRef = await addDoc(collection(this.#userDataBase, "posts"),
                post
            );

            // Set the "post_id" field with the randomly generated
            // post id
            await updateDoc(docRef, {
                "post_id": docRef.id
            });

            return docRef.id;
        } catch (error) {
            return error;
        }
    }

    // updatePost - an async function used to update an existing
    // post in the database
    // parameters:  Post object (or any object with post_id field)
    // return value:    true on success
    //                  false on fail
    async updatePost(post) {
        try {
            const postRef = doc(this.#userDataBase, "posts", String(post.post_id));

            // Set the "capital" field of the city 'DC'
            await updateDoc(postRef, post);
            return true;
        }
        catch (error) {
            return error;
        }
    }

    // ! TEST IDEA: math behind this function, mismatch b/w rating and ratingCount
    async rateUser(uid, rating, userType) {
        // get existing rating value and rating count
        // do math to find new rating value, add 1 to rating count
        // update rating value and rating count

        const user = await this.getUserInfoByUid(uid);
        const oldRating = (userType === "buyer" ? user.buyerRating : user.sellerRating) || 0;
        const oldRatingCount = (userType === "buyer" ? user.buyerRatingCount : user.sellerRatingCount) || 0;

        const newRatingCount = oldRatingCount + 1;
        const newRating = (oldRating + (rating - oldRating) / newRatingCount);


        if (userType === "buyer") {
            user.buyerRating = newRating;
            user.buyerRatingCount = newRatingCount;
        } else {
            user.sellerRating = newRating;
            user.sellerRatingCount = newRatingCount;
        }
        await this.updateUser(user);
        console.log(`Rated ${userType} ${uid} with rating ${rating}`);
    }

    async blockUser(uid) {
        // add uid to blockedUsers set/map
        const userID = this.#authenticationService.currentUser.uid;
        const userRef = doc(this.#userDataBase, "users", String(userID));
        await updateDoc(userRef, { blockedUsers: arrayUnion(uid) });
    }

    async reportUser(uid) {
        // increment reportCount of user by 1
        const userRef = doc(this.#userDataBase, "users", String(uid));
        await updateDoc(userRef, { reportCount: increment(1) });
    }

    // addMeassage - an async function used to add new message to
    // the message collection in the databse
    // parameters: message: Message object
    // Return value: the message_id of the new added message
    async addMessage(message) {
        try {
            const docRef = await addDoc(collection(this.#userDataBase, "messages"),
                message
            );

            // Set the "post_id" field with the randomly generated
            // post id
            await updateDoc(docRef, {
                "message_id": docRef.id
            });

            return docRef.id;
        } catch (error) {
            console.log(error);
            return error;
        }
    }


    // query message users
    // output: a list of users that have chatted with the current user
    async listUserswithChats() {
        let messageDB = collection(this.#userDataBase, "messages");
        let userDB = collection(this.#userDataBase, "users");
        curr_user = this.#authenticationService.currentUser.uid;
        const q_msgs_rec = query(messageDB, where("receiver", "==", curr_user));
        const q_msgs_sed = query(messageDB, where("sender", "==", curr_user));
        const msg_rec_snapshot = await getDocs(q_msgs_rec);
        const msg_sed_snapshot = await getDocs(q_msgs_sed);
        var userLsts = [];
        msg_rec_snapshot.forEach((doc) => {
            let sender = doc.data().sender;
            let receiver = doc.data().receiver;
            if (sender != curr_user && !userLsts.includes(sender)) { userLsts.push(sender); }
            if (receiver != curr_user && !userLsts.includes(receiver)) { userLsts.push(receiver); }
        })
        msg_sed_snapshot.forEach((doc) => {
            let sender = doc.data().sender;
            let receiver = doc.data().receiver;
            if (sender != curr_user && !userLsts.includes(sender)) { userLsts.push(sender); }
            if (receiver != curr_user && !userLsts.includes(receiver)) { userLsts.push(receiver); }
        })
        // get the users from the user db
        var userObjs = []
        const userSnapshots = await getDocs(userDB);
        userSnapshots.forEach((doc) => {
            if (userLsts.includes(doc.data().uid)) {
                userObjs.push(doc.data());
            }
        })
        return userObjs;
    }


    async getLatestMessage(uid) {
        const curr_user = this.#authenticationService.currentUser.uid;
        const msg_Lsts_sender = await this.listMessagesByUser(curr_user, uid);
        if (msg_Lsts_sender.length == 0) {
            const msg_Lsts_rec = await this.listMessagesByUser(uid, curr_user);
            return msg_Lsts_rec[msg_Lsts_rec.length - 1];
        } else {
            console.log(msg_Lsts_sender);
            return msg_Lsts_sender[msg_Lsts_sender.length - 1];
        }
    }


    // list Messages for a session: sorted by the creation time of the message
    // returns an array of messages sorted in ascending time for time created.
    async listMessagesByUser(sender, receiver) {
        const messageDB = collection(this.#userDataBase, "messages");
        const q_msgs = query(messageDB, where("sender", "==", sender),
            where("receiver", "==", receiver));
        const r_msgs = query(messageDB, where("receiver", "==", sender),
            where("sender", "==", receiver));
        const msg_snapshot_q = await getDocs(q_msgs);
        const msg_snapshot_r = await getDocs(r_msgs);
        var msg_Lsts = [];
        msg_snapshot_q.forEach(doc => {
            msg_Lsts.push(new Message_parse(doc));
        });
        msg_snapshot_r.forEach(doc => {
            msg_Lsts.push(new Message_parse(doc));
        })

        msg_Lsts.sort((a, b) => a.createdAt <= b.createdAt);
        return msg_Lsts;
    }


    /* async listPoststest() {
        try {
            let posts_list = [];
            collection(this.#userDataBase, "posts").get().then(function(querySnapshot) {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, "=>", doc.data());
                    posts_list.push(doc.data());
                    //console.log(doc.data());
                })
            });
            console.log('backend');
            console.log(posts_list);
            return posts_list;
        } catch (error) {
            return error;
        }
    } */

    // listPosts - an async function used to list all the posts
    // from the firestor
    // Parameters: None
    // Return value: An array of posts in the posts collection
    //                  from firestore
    async listPosts() {
        try {
            const querySnapshot = await getDocs(collection(this.#userDataBase, "posts"));

            let posts_list = [];

            querySnapshot.forEach((doc) => {
                // console.log(doc.id, "=>", doc.data());
                posts_list.push(doc.data());
            })

            return posts_list;
        } catch (error) {
            return error;
        }
    }

    // deletePost - an async function used to delete a post by post id
    // in firestore
    // parameter:   postId : String
    // return value: None
    async deletePost(postId) {
        /* console.log("deleting: ", postId); */

        return await deleteDoc(doc(this.#userDataBase, "posts", postId));
    }

    // getUserIcon - an async function used to the URL of user icon
    // parameters:  userID : String
    // return value:    icon URL : String
    async getUserIcon(userID) {
        try {
            const pathReference = ref(this.#storage, 'icons/' + String(userID) + '.jpg');

            return { "uri": await getDownloadURL(pathReference) };
        } catch (error) {
            console.log(error);
            return { "error": error, "uri": null };
        }
    }

    // updateUserIcon - an async function used to upload use icon into storage
    // parameter:   uid : String
    //              icon : Blob
    // return value:    
    async updateUserIcon(uid, icon) {
        const iconRef = ref(this.#storage, 'icons/' + String(uid) + '.jpg');

        uploadBytes(iconRef, icon).then((snapshot) => {
            // console.log('Uploaded a blob or file!');
        });
    }

    // getBlobFromURI - an async function used to get Blob object by the given uri
    // parameter:   uri : String
    // return value:    a Blob object if the uri is valid
    async getBlobFromURI(uri) {
        return await (await fetch(uri)).blob();
    }

    // getBookCover - an async method used to get the url of a book's image
    // parameter:   postId : String
    // return value:    a String of the uri
    async getBookCover(postId) {
        try {
            const pathReference = ref(this.#storage, 'posts/' + String(postId) + '.jpg');

            return { "uri": await getDownloadURL(pathReference) };
        } catch (error) {
            return { "error": error, "uri": null };
        }
    }

    // uploadBookPic - an async method used to upload book picture to storage
    // parameter:   postId : String
    //              pic : Blob
    // return value: None
    async uploadBookPic(postId, pic) {
        const picRef = ref(this.#storage, 'posts/' + String(postId) + '.jpg');

        uploadBytes(picRef, pic);
    }

    // getSellingPosts - an async method used to get all the selling posts
    // parameter: None
    // return value: an array of posts that are selling posts
    async getSellingPosts() {
        try {
            const q = query(collection(this.#userDataBase, "posts"), where("type", "==", "Selling"));

            const querySnapshot = await getDocs(q);

            let posts_list = [];

            querySnapshot.forEach((doc) => {
                // console.log(doc.id, "=>", doc.data());
                posts_list.push(doc.data());
            })

            return posts_list;
        }
        catch (error) {
            return error;
        }
    }

    // getBuyingPosts - an async method used to get all the buying posts
    // parameter: None
    // return value: an array of posts that are buying posts
    async getBuyingPosts() {
        try {
            const q = query(collection(this.#userDataBase, "posts"), where("type", "==", "Buying"));

            const querySnapshot = await getDocs(q);

            let posts_list = [];

            querySnapshot.forEach((doc) => {
                // console.log(doc.id, "=>", doc.data());
                posts_list.push(doc.data());
            })

            return posts_list;
        }
        catch (error) {
            return error;
        }
    }
}

export default Backend;

// part beyond this point are tests that I have done for the functionality
// of this module

// Backend = new Backend();

/* const uid = await bn.signIn('anpgtao@gmail.com', '987654321');

console.log(uid) */

// const uid = await Backend.signUp("apgtao@gmail.com", "12345678")

/* const test = await Backend.getUserInfo("apgtao@gmail.com", "12345678");

console.log(test); */

/* console.log(await Backend.addUser({
    uid: "1234567", email: "7654321",
    sellrating: 4, "buyrating": 5
})); */

// console.log(await Backend.updatePost({post_id: 1234567, title: "welcome", content: "left"}));

// console.log(await Backend.addPost({ user_id: 1234567, post_content: "hello world" }))

/* console.log(await Backend.getUserIcon('test_user'));

console.log(await Backend.getUserIcon('CuKe0_3VUAAVsdz'));

console.log(await Backend.getUserIcon('wrong_Uesr')); */