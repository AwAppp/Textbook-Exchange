import User from "./user";

class Message_parse{
    constructor(doc) {
        this._id = doc.data()._id;
        this.sender = doc.data().sender;
        this.receiver = doc.data().receiver;
        this.createdAt = doc.data().createdAt.toDate();
        this.text = doc.data().text;
        this.user = doc.data().user;
    }
}

class Message {
    constructor(id, sender, receiver, createdAt,  text, user) {
        this._id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.createdAt = createdAt;
        this.text = text;
        this.user = user;
    }
}

export  { Message, Message_parse};