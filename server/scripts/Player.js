class Player {
    static MaxCount = 0;
    static Count = 0;
    static Id = 0;
    static Instances = {};

    static get Count() {
        return Player.Count;
    }

    static get Id() {
        return Player.Id;
    }

    constructor() {
        if (Player.MaxCount <= Player.Count) return false;
        this.id = Player.Id++;
        Player.Instances[this.id] = this;
        this.socketId;
    }

    get id() {
        return this.id;
    }
}