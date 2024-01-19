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

    constructor(socketId) {
        // Player 객체 기초 설정
        this._id = Player.#_Id++;
        Player.Instances[this.id] = this;
        Player.#_Count++;

        this.socketId = socketId; // 유저의 소켓 id
        this.room = null; // 참가한 방 객체
        this.name; // 유저 이름
        this.role; // 유저 역할
        this.number; // 방에서 유저 번호
        this.skill; // 유저의 스킬
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
        if (!room) return 'no room';
        if (room.players.length > 8) return 'room full';
        if (room.password && !password) return 'must have password';
        if (room.password && room.password !== password) return 'wrong password';

        this.role = 'user';
        this.room = room;
        this.number = room.numbers.indexOf(0) + 1;
        room.numbers[this.number - 1] = this.id;
        room.players.push(this);
        this.skill = 'dash';
    }

    // 방 퇴장
    leaveRoom() {
        if (!this.room) return 'must join room';
        
        this.room.players.splice(this.room.players.indexOf(this), 1);
        this.room.numbers[this.number - 1] = 0;
        let ownerChange = false; // 추가 emit을 위해 필요함
        if (this.room.players.length < 1) this.room.delete(); // 참가 인원 없을시 방 삭제
        else if (this.role === 'owner') { // 나간 플레이어가 방장이라면 방장 이전
            this.giveOwner(this.room.players[0]); // 가장 먼저 들어온사람이 방장
            ownerChange = true;
        }
        this.room = null;
        this.name = null;
        this.role = null;
        this.number = null;
        this.skill = null;
        return ownerChange;
    }

    // 다른 플레이어에게 방장 이전
    giveOwner(target) {
        if (!this.room) return 'must join room';
        if (!target || this === target) return 'wrong player'; // 없거나 자신이거나
        if (this.role !== 'owner' || this.room !== target.room) return 'no permission';
        this.role = 'user';
        target.role = 'owner';
        this.room.owner = target;
    }

    // 다른 플레이어 강제 퇴장시키기
    kickPlayer(target) {
        if (!this.room) return 'must join room';
        if (!target || this === target) return 'wrong player';
        if (this.role !== 'owner' || this.room !== target.room) return 'no permission';
        target.leaveRoom();
    }

    // 번호 변경
    changeNumber(number) {
        if (!this.room) return 'must join room';
        if (number < 1 || 8 < number) return 'wrong number';
        if (this.room.numbers[number - 1]) return 'already exist number';
        this.room.numbers[this.number - 1] = 0;
        this.number = number;
        this.room.numbers[number - 1] = this.id;
    }

    // 스킬 변경
    changeSkill(skill) {
        if (!this.room) return 'must join room';
        if (this.skill === skill || !['dash', 'teleport'].includes(skill)) return 'wrong skill'; // 존재하지 않는 스킬이거나 이미 사용하는 스킬이거나
        this.skill = skill;
    }
}

module.exports = Player;
