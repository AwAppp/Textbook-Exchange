import { initializeApp } from 'firebase/app';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

import {
    getFirestore,
    collection, setDoc, doc, getDoc, updateDoc
} from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class Backend {
    #userDataBase;
    #authenticationService;

    constructor() {
        this.#authenticationService = getAuth(app);
        this.#userDataBase = getFirestore(app);
    }

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
            const errorCode = error.code;
            const errorMessage = error.message;

            return null;
            // ..
        }
    }

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
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    async getUserInfo(username, password) {
        const uid = await this.signIn(username, password);

        const docRef = doc(this.#userDataBase, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());

            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

            return null;
        }
    }

    async addUser(user) {
        try {
            await setDoc(doc(this.#userDataBase,
                "users", String(user.uid)),
                user
            );

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateUser(user) {
        try {
            const userRef = doc(this.#userDataBase, "users", String(user.uid));

            // Set the "capital" field of the city 'DC'
            await updateDoc(userRef, user);
            return true;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }

    async addPost(post) {
        try {
            await setDoc(doc(this.#userDataBase,
                "posts", String(post.post_id)),
                post
            );

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updatePost(post) {
        try {
            const postRef = doc(this.#userDataBase, "posts", String(post.post_id));

            // Set the "capital" field of the city 'DC'
            await updateDoc(postRef, post);
            return true;
        }
        catch (error) {
            console.log(error);
            return false
        }
    }
}

Backend = new Backend();

/* const uid = await bn.signIn('anpgtao@gmail.com', '159357tap.');

console.log(uid) */

// const uid = await Backend.signUp("apgtao@gmail.com", "12345678")

// const test = await Backend.getUserInfo("apgtao@gmail.com", "12345678");

/* console.log(await Backend.addUser({
    uid: "1234567", email: "7654321",
    sellrating: 4, "buyrating": 5
})); */

console.log(await Backend.updatePost({post_id: 1234567, title: "welcome", content: "left"}));