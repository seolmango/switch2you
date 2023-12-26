export default class Room {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Id = 1;
    static Instances = {};

    static get Count() {
        return Room._Count;
    }

    static get Id() {
        return Room._Id;
    }

    constructor() {
        // Room 객체 기초 설정
        if (Room.MaxCount <= Room.Count) return false;
        this._id = Room.#_Id++;
        Room.Instances[this.id] = this;
        Room.#_Count++;

        this.public = true; // 공개방인가? 공개방은 퀵매칭 포함됨.
        this.password = false; // 비공개방일시 방 비밀번호
        this.players = []; // 참가한 유저 객체들
        this.owner; // 방장 유저 객체
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Room.Instances[this.id];
        Player.#_Count--;
    }
}