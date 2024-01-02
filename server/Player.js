class Player {
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
        this.room = null; // 참가한 방 객체
        this.name; // 유저 이름
        this.role; // 유저 역할
    }

    get id() {
        return this._id;
    }

    delete() {
        delete Player.Instances[this.id];
        Player.#_Count--;
    }

    update(name) {
        this.name = name;
    }

    // 방 참가
    joinRoom(room, password = false) {
        if (this.room) return 'already join room';
        if (room.players.length > 8) return 'room full';
        if (room.password !== password) return 'wrong password';

        this.role = 'user';
        this.room = room;
        room.players.push(this);
    }

    // 플레이어에게 방장 이전
    giveOwner(target) {
        if (this.role !== 'owner' || this.room !== target.room) return 'no permission'
        this.role = 'user';
        target.role = 'owner';
        this.room.owner = target;
    }

    // 방 퇴장
    leaveRoom() {
        if (!this.room) return 'no join room';
        
        delete this.room.players[this.id];
        let ownerChange = false; // 추가 emit을 위해 필요함
        if (this.room.players.length < 1) Room.delete(); // 참가 인원 없을시 방 삭제
        else if (this.role === 'owner') { // 나간 플레이어가 방장이라면 방장 이전
            this.giveOwner(this.room.players[0]); // 가장 먼저 들어온사람이 방장
            ownerChange = true;
        }
        this.room = null;
        this.name = null;
        this.role = null;
        return ownerChange;
    }
}

module.exports = Player;