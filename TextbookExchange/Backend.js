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
    getDocs
} from "firebase/firestore";

import {
    getStorage,
    ref, uploadBytes, uploadString, getDownloadURL, connectStorageEmulator
} from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPXF-1VTA6-O76lVI3T6Tws894coJ2xrQ",
    authDomain: "bookschange-d09eb.firebaseapp.com",
    projectId: "bookschange-d09eb",
    storageBucket: "bookschange-d09eb.appspot.com",
    messagingSenderId: "1065896407600",
    appId: "1:1065896407600:web:acc6efc17988f7bb8cb3f5",
    measurementId: "G-TWVJVKK33M",
    storageBucket: "bookschange-d09eb.appspot.com"
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
            return {"error_message": "No such document"};
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
            return {"error_message": "No such document"};
        }
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
    // return value:    true on success
    //                  false on fail
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
            return error;
        }
    }

    // listPosts - an async function used to list all the posts
    // from the firestor
    // Parameters: None
    // Return value: An array of posts in the posts collection
    //                  from firestore
    async listPoststest() {
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
    }

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
    // getUserIcon - an async function used to the URL of user icon
    // parameters:  userID : String
    // return value:    icon URL : String
    async getUserIcon(userID) {
        try {
            const pathReference = ref(this.#storage, 'icons/' + String(userID) + '.jpg');

            return {"uri": await getDownloadURL(pathReference)};
        } catch(error) {
            return {"error": error, "uri": null};
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