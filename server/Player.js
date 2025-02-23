class Player {
    static MaxCount = 0;
    static #_Count = 0;
    static #_Id = 1;
    static #_Instances = {};
    #_id;

    static get Count() {
        return Player.#_Count;
    }

    static get Id() {
        return Player.#_Id;
    }

    static get Instances() {
        return Player.#_Instances;
    }

    constructor(socketId) {
        // Player 객체 기초 설정
        this.#_id = Player.#_Id++;
        Player.#_Instances[this.id] = this;
        Player.#_Count++;

        this.socketId = socketId; // 유저의 소켓 id
        this.device = 'unknown'; // 유저의 장치
        this.room = null; // 참가한 방 객체
        this.name; // 유저 이름
        this.role; // 유저 역할
        this.number; // 방에서 유저 번호
        this.ready; // 게임 준비 여부
        this.initStat();
        this.actions = []; // 유저가 취하고 있는 행동들 (fps를 맞추기 위함임)
    }

    get id() {
        return this.#_id;
    }

    delete() {
        delete Player.#_Instances[this.id];
        Player.#_Count--;
    }

    // 이름 변경
    changeName(name) {
        this.name = name;
    }

    // 스탯 초기화
    initStat() {
        this.stat = {'skill': 'dash', 'moveSpeed': 10};
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
        this.ready = null;
        this.initStat();
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
        if (this.stat.skill === skill || !['dash', 'teleport'].includes(skill)) return 'wrong skill'; // 존재하지 않는 스킬이거나 이미 사용하는 스킬이거나

        this.stat.skill = skill;
    }

    // 게임 준비 변경
    changeReady(ready) {
        if (!this.room) return 'must join room';
        
        this.ready = ready;
    }

    // 방에서 플레이 할 월드 변경
    changeRoomMap(mapIndex) {
        if (!this.room) return 'must join room';
        if (this.role !== 'owner') return 'no permission';

        const result = this.room.changeMap(mapIndex);
        if (result) return result;
    }

    // 게임 시작
    startGame() {
        if (!this.room) return 'must join room';
        if (this.role !== 'owner') return 'no permission';

        const result = this.room.startGame();
        if (result) return result;
    }

    // 플레이어 이동
    move(doing, direction) {
        if (!this.room) return 'just join room';
        if (!this.room.playing) return 'must playing game';
        this.actions.move = {'doing': doing, 'direction': direction};
    }
}

module.exports = Player;
