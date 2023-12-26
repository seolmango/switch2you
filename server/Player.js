class Player {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Id = 0;
    static Instances = {};

    static get Count() {
        return Player._Count;
    }

    static get Id() {
        return Player._Id;
    }

    constructor() {
        // Player 객체 기초 설정
        if (Player.MaxCount <= Player.Count) return false;
        this._id = Player.#_Id++;
        Player.Instances[this.id] = this;
        Player.#_Count++;

        this.socketId;
        this.name;
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Player.Instances[this.id];
        Player.#_Count--;
    }
}

module.exports = Player;