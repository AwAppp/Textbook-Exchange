import User from "./user";

class Message_parse{
    constructor(doc) {
        this.id = doc.data().id;
        this.sender = doc.data().sender;
        this.receiver = doc.data().receiver;
        this.createdAt = doc.data().toDate();
        this.text = doc.data().text;
        this.user = doc.data().user;
    }
}

class Message {
    constructor(id, sender_email, receiver, createdAt,  text, user) {
        this.id = id;
        this.sender = sender_email;
        this.receiver = receiver;
        this.createdAt = createdAt;
        this.text = text;
        this.user = user;
    }
}

export  { Message, Message_parse};