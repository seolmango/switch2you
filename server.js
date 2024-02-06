const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const Config = require('./server/config.json');
const Player = require('./server/Player.js');
const Room = require('./server/Room.js');
const Map2d = require('./server/Map2d.js');
const Vector2 = require('./server/Polygons/Vector2.js');
const Circle = require('./server/Polygons/Circle.js');
const OBB = require('./server/Polygons/OBB.js');


// 설정 불러오기
Player.MaxCount = Config.playerMaxNum;
Room.MaxCount = Config.roomMaxNum;


const port = process.env.PORT || 3000;
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'test')));
http.listen(port, function (){
    console.log('listening on : http://localhost:' + port);
});


/**
 * Player객체 또는 배열을 받고, 공유에 필요한 데이터들만 뽑아 반환합니다.
 * @param {Player[]} players 
 * @returns 
 */
function getPlayerInfo(players) {
    const infoFilter = (player) => { return {'number': player.number, 'name': player.name, 'role': player.role, 'device': player.device, 'skill': player.skill} }
    if (Array.isArray(players))
        return players.map(infoFilter);
    else
        return infoFilter(players);
}

function getRoomInfo(rooms) {
    const infoFilter = (room) => {return {'id': room.id, 'name': room.name, 'ownerName': room.owner.name, 'passwordExist': room.password ? true : false, 'playerCount': room.players.length, 'playing': room.playing}}
    if (Array.isArray(rooms))
        return rooms.map(infoFilter);
    else
        return infoFilter(rooms);
}

function getPolygonInfos(polygons) {
    const infoFilter = (polygon) => {
        let info = {'type': polygon.type, 'x': polygon.pos.x, 'y': polygon.pos.y, 'rotation': polygon.rotation, 'velocity': polygon.velocity, 'checkWidth2': polygon.checkWidth2, 'checkHeight2': polygon.checkHeight2};
        if (polygon.type === 'OBB') {
            info['width2'] = polygon.width2;
            info['height2'] = polygon.height2;
        } else {
            info['radius'] = polygon.radius;
        }
        return info;
    }
    if (Array.isArray(polygons))
        return polygons.map(infoFilter);
    else
        return infoFilter(polygons);
}

function checkData(...args) {
    for (const element of args) {
        let wrong = true;
        for (let i = 1; i < element.length; i++)
            if (element[i] === 'int') {
                if (Number.isInteger(element[0])) wrong = false;
            } else if (element[i] === 'number' || element[i] === 'string' || element[i] === 'boolean' || element[i] === 'function') {
                if (typeof element[0] === element[i]) wrong = false;
            } else
                if (element[0] === element[i]) wrong = false;
        if (wrong) return false;
    };
    return true;
}


// 소켓 코드
io.on('connection', (socket) => {

    // Player(세션) 추가
    if (Player.MaxCount <= Player.Count) { // 서버가 꽉찼다면
        socket.emit("server full");
        socket.disconnect();
        return;
    }
    const player = new Player(socket.id); // 접속한 플레이어(세션) 마다 생성
    socket.emit('connected'); // 연결 응답 신호 전송
    console.log('player connected: ', player.socketId, player.id);


    // Player 연결 끊김
    socket.on('disconnect', () => {
        const room = player.room;
        if (room){
            const number = player.number;
            const result = player.leaveRoom();
            if (result) io.to(room.id).emit('owner changed', room.owner.number);
            if (room.players.length > 0) io.to(room.id).emit('player leaved', number);
        }
        player.delete();
        socket.disconnect();
        console.log('player disconnected: ', player.socketId, player.id);
    });


    // 기초 플레이어 정보 설정
    socket.on('set player info', (device, callback) => {
        if (!checkData([device, 'string'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        } else if (device != 'phone' && device != 'computer') {
            callback({'status': 400, 'message': 'wrong device'});
            return;
        }
        player.device = device;
        callback({'status': 200});
    })


    // 방 목록
    socket.on('get room list', (page, callback) => {
        if (!checkData([page, 'int'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        } else if (page < 1) {
            callback({'status': 400, 'message': 'wrong page'});
            return;
        }

        const showNum = 6; // test용. page당 보여지는 방의 개수
        const roomList = Object.values(Room.Publics);
        const maxPage = Math.ceil(roomList.length / showNum);
        if (page > maxPage) {
            callback({'status': 400, 'message': 'no page'});
            return;
        }
        let maxIndex = page * showNum;
        if (page * showNum > roomList.length) maxIndex = roomList.length;
        callback({'status': 200, 'maxPage': maxPage, 'roomInfos': getRoomInfo(roomList.slice(page * showNum - showNum, maxIndex))});
    })


    // 방 생성
    socket.on('create room', (playerName, roomName, public, password, callback) => { // 1. 방 참가 이벤트가 들어오면
        if (!checkData([playerName, 'string'], [roomName, 'string'], [public, 'boolean'], [password, 'string', false], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return; // 2-1. 데이터의 자료형 확인 후
        } else if (player.room) {
            callback({'status': 400, 'message': 'already join room'});
            return;
        }

        if (Room.MaxCount <= Room.Count) { // 2-2. 모든 조건을 확인 후 확정이 나면
            callback({'status': 400, 'message': 'server full'});
            return;
        }
        player.update(playerName);
        const room = new Room(player, roomName, public, password); // 3. 입력한 (남에게 보여지는) 정보를 업데이트 + 실제 작업 진행
        socket.join(room.id); // 4. room 관련 처리하고 소켓신호 보내기
        callback({'status': 200, 'roomInfo': getRoomInfo(room)});
    })


    // 방 참가
    socket.on('join room', (playerName, roomId, password, callback) => {
        if (!checkData([playerName, 'string'], [roomId, 'string'], [password, 'string', false], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const result = player.joinRoom(Room.Instances[roomId], password);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        player.update(playerName);
        socket.join(player.room.id);
        socket.to(player.room.id).emit('player joined', getPlayerInfo(player));
        callback({'status': 200, 'roomInfo': getRoomInfo(player.room), 'playerInfos': getPlayerInfo(player.room.players), 'playerNumber': player.number});
    })


    // 랜덤 방 매칭
    socket.on('join random room', (playerName, callback) => {
        if (!checkData([playerName, 'string'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        } else if (player.room) { // 서버 최적화 때문에 사전에 검사
            callback({'status': 400, 'message': 'already join room'});
            return;
        }

        // 공개 빈 방 탐색
        for (const room of Object.values(Room.Publics)) {
            if (room.password || room.players.length > 8 || room.playing) continue; // 비공개거나, 비밀번호가 있거나, 꽉찾거나, 게임중이면 건너뛰기
            player.update(playerName);
            player.joinRoom(room);
            socket.join(room.id);
            socket.to(room.id).emit('player joined', getPlayerInfo(player));
            callback({'status': 200, 'roomInfo': getRoomInfo(player.room), 'playerInfos': getPlayerInfo(player.room.players), 'playerNumber': player.number});
            break;
        }

        // 없다면 방 생성
        if (!player.room) {
            if (Room.MaxCount <= Room.Count) {
                callback({'status': 400, 'message': 'server full'});
                return;
            }
            player.update(playerName);
            const room = new Room(player);
            socket.join(room.id);
            callback({'status': 200, 'roomInfo': getRoomInfo(room)});
        }
    })


    // 방 퇴장
    socket.on('leave room', (callback) => {
        if (typeof callback !== 'function') return;

        const room = player.room;
        const number = player.number;
        const result = player.leaveRoom();
        if (result === 'must join room') {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        socket.leave(room.id);
        if (result) socket.to(room.id).emit('owner changed', room.owner.number); // 방장이 바뀌었다면
        if (room.players.length > 0) socket.to(room.id).emit('player leaved', number); // 방에 사람이 남아 있다면
    })


    // 방장 이전. targetId는 방장이 이전될 플레이어의 id.
    socket.on('change owner', (targetNumber, callback) => {
        if (!checkData([targetNumber, 'int'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const result = player.giveOwner(Player.Instances[player.room.numbers[targetNumber - 1]]);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.to(player.room.id).emit('owner changed', targetNumber);
    })


    // 강제 퇴장
    socket.on('kick player', (targetNumber, callback) => {
        if (!checkData([targetNumber, 'int'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const target = Player.Instances[player.room.numbers[targetNumber - 1]];
        const result = player.kickPlayer(target);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.sockets.sockets.get(target.socketId).leave(player.room.id);
        io.to(player.room.id).emit('player leaved', targetNumber);
        io.to(target.socketId).emit('you kicked');
    })


    // 플레이어 번호 변경
    socket.on('change player number', (number, callback) => {
        if (!checkData([number, 'int'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const tempNumber = player.number;
        const result = player.changeNumber(number);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.to(player.room.id).emit('player number changed', tempNumber, number);
    })


    // 플레이어 스킬 변경
    socket.on('change player skill', (skill, callback) => {
        if (!checkData([skill, 'string'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const result = player.changeSkill(skill);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.to(player.room.id).emit('player skill changed', player.number, player.skill);
    })


    // 게임 준비 여부 변경
    socket.on('ready game', (ready, callback) => {
        if (!checkData([ready, 'boolean'], [callback, 'function'])) {
            if (typeof callback === 'function') callback({'status': 400, 'message': 'wrong data'});
            return;
        }

        const result = player.setReady(ready);
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.to(player.room.id).emit('player readied', player.number, player.ready);
    })


    // 게임 시작
    socket.on('start game', (callback) => {
        if (typeof callback !== 'function') return;

        const result = player.startGame();
        if (result) {
            callback({'status': 400, 'message': result});
            return;
        }
        callback({'status': 200});
        io.to(player.room.id).emit('game started');
    })


    socket.on('move', (dx, dy, rotate, callback) => {
        if (!player.map2d) player.map2d = new Map2d();
        player.map2d.polygons[0].pos.x += dx;
        player.map2d.polygons[0].pos.y += dy;
        player.map2d.polygons[0].rotation += rotate * Math.PI / 180;
        callback(getPolygonInfos(player.map2d.polygons));
    })

    socket.on('check', (callback) => {
        const result = player.map2d.polygons[0].collisionCheck(player.map2d.polygons[1]);
        callback(result);
    })


    /**
    

    socket.on('map change', function (value) {
        Room.MapId[PlayerRoomId] = (Room.MapId[PlayerRoomId] + value + MapData.typeCount) % MapData.typeCount;
        io.to(PlayerRoomId).emit('map change', Room.MapId[PlayerRoomId]);
    })

    // 여기서부터 인게임 코드
    socket.on('start game', function () {
        RoomMg.StartGame(PlayerRoomId);
        io.to(PlayerRoomId).emit('start game', Room.PlayerLiveStates[PlayerRoomId], Room.LiveCounts[PlayerRoomId], Room.PlayerXs[PlayerRoomId], Room.PlayerYs[PlayerRoomId], Room.PlayerSightRanges[PlayerRoomId], Room.TaggerIds[PlayerRoomId], Room.Map[PlayerRoomId]);
    })

    socket.on('client update', function (PlayerDx, PlayerDy, PlayerBoost) {
        if (Room.PlayerLiveStates[PlayerRoomId][PlayerRoomNum] === 0) {
            return;
        }
        Room.PlayerDxs[PlayerRoomId][PlayerRoomNum] += PlayerDx;
        Room.PlayerDys[PlayerRoomId][PlayerRoomNum] += PlayerDy;
        Room.PlayerBoosts[PlayerRoomId][PlayerRoomNum] = PlayerBoost;
    })

    socket.on('change challenge', function (TargetId) {
        io.to(PlayerRoomId).emit('change challenge', PlayerId, TargetId);
        Room.PlayerGameStats[PlayerRoomId][PlayerRoomNum][2] += 1;
        if (RoomMg.CheckTouch(PlayerId, Room.TaggerIds[PlayerRoomId], (TaggerChaRad + CharRad) * 1000)) {
            Room.TaggerIds[PlayerRoomId] = TargetId;
            Room.TaggerChangeTime[PlayerRoomId] = Date.now();
            io.to(PlayerRoomId).emit('change tagger', TargetId);
            Room.PlayerGameStats[PlayerRoomId][PlayerRoomNum][1] += 1;
        }
    })

    socket.on('emoji',function(what){
        io.to(PlayerRoomId).emit('emoji',PlayerId,what);
    })
    */

});