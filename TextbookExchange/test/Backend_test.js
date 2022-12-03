/* This module is used for testing the Backend module of this
project */

import Backend from '../Backend.js';

import { strict as assert } from 'assert';
import { type } from 'os';

const bk = new Backend();

// TODO: to test the code, the first step is to fill these
//          two variables.

var test_username = "abcd@gmail.com";

var test_password = "12345678";

assert(test_username != "", "Please enter the username for test");

assert(test_password != "", "Please enter the password for test");

// sign in with wrong password
var uid = await bk.signIn(test_username, test_password);

if(typeof(uid) == "object" && uid.hasOwnProperty('code') && uid.code == "auth/user-not-found") {
    uid = await bk.signUp(test_username, test_password);
}

uid = await bk.signIn(test_username, test_password + "abcd");

assert(typeof(uid) == "object" && uid.code == "auth/wrong-password");

uid = await bk.signIn(test_username, test_password);

assert(typeof(uid) == "string");

var userInfo = await bk.getUserInfo(test_username, test_password);

assert(userInfo.uid == uid, "uid does NOT match with the one in firestore");

const test_num = Math.random();

await bk.updateUser({test_field: test_num, uid: uid});

assert.equal((await bk.getUserInfoByUid(uid)).test_field, test_num);

var post_id = await bk.addPost({content: "hello world"});

assert(typeof(post_id) == "string");

assert(await bk.updatePost({post_id: post_id, content: "test"}));

const allPost = await bk.listPosts();

assert(typeof (allPost) == "object");


const testRateUser = async () => {
    const getRandomRatingValue = () => Math.floor(Math.random() * 5) + 1;
    
    const rating1 = getRandomRatingValue();
    const rating2 = getRandomRatingValue();
    const rating3 = getRandomRatingValue();

    await bk.rateUser(uid, rating1, "buyer");
    const average1 = rating1;
    let userInfo = await bk.getUserInfoByUid(uid);
    assert.equal(userInfo.buyerRating, average1);
    assert.equal(userInfo.buyerRatingCount, 1);

    await bk.rateUser(uid, rating2, "buyer");
    const average2 = (rating1 + rating2) / 2;
    userInfo = await bk.getUserInfoByUid(uid);
    assert.equal(userInfo.buyerRating, average2);
    assert.equal(userInfo.buyerRatingCount, 2);

    await bk.rateUser(uid, rating3, "buyer");
    const average3 = (rating1 + rating2 + rating3) / 3;
    userInfo = await bk.getUserInfoByUid(uid);
    assert.equal(userInfo.buyerRating, average3);
    assert.equal(userInfo.buyerRatingCount, 3);
}
await testRating();

const testBlockUser = async () => {
    const generatedID = Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join("");

    await bk.blockUser(generatedUID);
    assert.ok((await bk.getUserInfoByUid(generatedUID)).blockedUsers.includes(uid));
}
await testBlockUser();

const testReportUser = async () => {
    const reportCount = (await bk.getUserInfoByUid(uid)).reportCount;
    await bk.reportUser(uid);
    assert.equal((await bk.getUserInfoByUid(uid)).reportCount, reportCount + 1);
}
await testReportUser();
