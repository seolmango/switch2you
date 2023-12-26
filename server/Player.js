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
        if (Player.MaxCount <= Player.Count) return false;
        this._id = Player.#_Id++;
        Player.Instances[this.id] = this;
        this.socketId;
    }

    get id() {
        return this._id;
    }
}

module.exports = Player;