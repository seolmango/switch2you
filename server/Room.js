class Room {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Id = 0;
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

        this.players = [];
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Room.Instances[this.id];
        Player.#_Count--;
    }
}

module.exports = Room;