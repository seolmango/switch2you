const Map2d = require('./Map2d.js');

class Room {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Instances = {};
    static #_Publics = {};
    #_id;

    static get Count() {
        return Room.#_Count;
    }

    static get Instances() {
        return Room.#_Instances;
    }

    static get Publics() {
        return Room.#_Publics;
    }

    constructor(owner, roomName = false, public_ = true, password = false) {
        // Room 객체 기초 설정
        do this.#_id = randomString(8); // 방 id. 중복되지 않음. 경우의 수가 64^8이라 중복검사를 이 방법으로 하는게 좋음.
        while (Room.Instances[this.id]);
        Room.#_Instances[this.id] = this;
        Room.#_Count++;
        if (public_) Room.#_Publics[this.id] = this; // 공개방 딕셔너리 (리스트로 할시 장단점있음)

        this.public = public_; // 공개방인가? 공개방은 퀵매칭 포함됨.
        this.password = password; // 방 비밀번호
        this.playing = false; // 게임중인가? 게임중인방은 퀵매칭에서 제외됨.
        this.players = []; // 참가한 유저 객체들
        this.owner = owner; // 방장인 플레이어 객체. 이 프로퍼티가 굳이 왜 필요하나 싶지만, 방에 owner는 1명 뿐이라는 특이성 때문에 필요함.
        if (roomName) this.name = roomName; // 방 이름
        else this.name = owner.name + '\'s Room';
        this.numbers = [0, 0, 0, 0, 0, 0, 0, 0]; // 번호 안 썼는지 여부들. 0이면 안썼고, 0이 아니면 썼음. 0이 아닌 숫자는 그 번호에 해당하는 player의 id.
        this.map2d; // 방의 맵 (1대1 대응)
        owner.joinRoom(this, password);
        owner.role = 'owner';
    }

    get id() {
        return this.#_id;
    }

    delete() {
        if (this.public) delete Room.#_Publics[this.id];
        delete Room.#_Instances[this.id];
        Room.#_Count--;
    }

    startGame() {
        if (this.players.length < 3) return 'not enough player';
        if (this.playing) return 'already play game';
        let readyCheck = true;
        this.players.forEach((player) => {
            if (player.ready === false) {
                readyCheck = false;
                return false;
            }
        })
        if (!readyCheck) return 'not all ready';

        this.playing = true;
        this.map2d = new Map2d();
    }
}

function randomNumber(min, max) {
    return Math.floor((Math.random()) * (max - min)) + min;
}

function randomString(length) {
    value = ''
    for (let i = 0; i < length; i++)
        value += '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'[randomNumber(0, 64)];
    return value;
}

module.exports = Room;