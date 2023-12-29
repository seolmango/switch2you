class Room {
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

    constructor(owner) {
        // Room 객체 기초 설정
        if (Room.MaxCount <= Room.Count) return false;
        this._id = Room.#_Id++;
        Room.Instances[this.id] = this;
        Room.#_Count++;

        this.public = true; // 공개방인가? 공개방은 퀵매칭 포함됨.
        this.password = false; // 비공개방일시 방 비밀번호
        this.playing = false; // 게임중인가? 게임중인방은 퀵매칭에서 제외됨.
        this.players = [owner]; // 참가한 유저 객체들
        this.owner = owner; // 방장인 플레이어 객체. 이 프로퍼티가 굳이 왜 필요하나 싶지만, 방에 owner는 1명 뿐이라는 특이성 때문에 필요함.
        owner.room = this;
        owner.role = 'owner';
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Room.Instances[this.id];
        Room.#_Count--;
    }
}

module.exports = Room;