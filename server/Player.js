export default class Player {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Id = 1;
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

        this.socketId; // 유저의 소켓 id
        this.name; // 유저 이름
        this.room = null; // 참가한 방 객체
        this.role; // 참가한 방에서의 역할. owner/manager/user
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Player.Instances[this.id];
        Player.#_Count--;
    }

    // 방 참가
    joinRoom(room, password = false) {
        if (this.room) return 'already join room';
        if (room.player.length > 8) return 'room full';
        if (room.password !== password) return 'wrong password';

        this.room = room;
        this.role = 'user';
        room.players.push(this);
    }

    // 플레이어에게 방장 부여
    getOwner() {
        if (this.room.owner) this.room.owner.role = 'manager';
        this.role = 'owner';
        this.room.owner = this;
    }

    // 방 퇴장
    exitRoom() {
        if (!this.room) return 'no join room';
        delete this.room.players[this.id];

        ownerChange = false; // 방장이 변경됐는가? (추가 emit을 위해 필요함)
        if (this.room.player.length < 1) Room.delete(); // 참가 인원 없을시 방 삭제
        else if (this.role === 'owner') {
            Object.values(this.room.players)[0].getOwner();
            ownerChange = this.room.owner;
        }
        this.room = null;
        return ownerChange;
    }
}