import User from "./user";

class Message{
    constructor(doc) {
        this.id = doc.data().id;
        this.sender = doc.data().sender;
        this.receiver = doc.data().receiver;
        this.createdAt = doc.data().toDate();
        this.text = doc.data().text;
        this.user = doc.data().user;
    }
}

export default Message;