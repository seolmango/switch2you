import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import * as Config from './server/config.json' assert { type: 'json' };
import Player from './server/Player.js';
import Room from './server/Room.js';


// 설정 불러오기
Player.MaxCount = Config.playerMaxNum;
Room.MaxCount = Config.roomMaxNum;


// 서버 실행
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'dist')));


// 소켓 코드
io.on('connection', (socket) => {

    // Player(세션) 추가
    const player = new Player(); // 접속한 플레이어(세션) 마다 생성
    if (!player) { // 서버가 꽉찼다면
        io.to(socket.id).emit("server full");
        socket.disconnect();
    }
    player.socketId = socket.id;
    socket.emit('connected', player.id); // 연결 응답 신호 전송
    console.log('user connected: ', player.socketId, player.id);


    // Player 연결 끊김
    socket.on('disconnect', () => {
        player.delete();
        socket.disconnect();
        console.log('user disconnected: ', player.socketId, player.id);
    });


    // 방 생성
    socket.on('create room', (playerName) => {
        if (player.room) {
            socket.emit('already join room');
            return false;
        }

        room = new Room();
        player.joinRoom(room);
        player.name = playerName;
        player.getOwner();
        socket.emit('room created', room.id);
    })


    // 방 참가
    socket.on('join room', (playerName, roomId, password) => {
        error = player.joinRoom(Room.Instances[roomId]);
        if (error) {
            socket.emit(error);
            return false;
        }
        player.name = playerName;
        socket.emit('room joined', room.id);
    })


    // 랜덤 방 매칭
    socket.on('join random room', (playerName) => {
        if (player.room) {
            socket.emit('already join room');
            return false;
        }

        // 공개 빈 방 탐색
        for (room of Room.Instances) {
            if (!room.public || room.players.length > 8) continue;
            player.join(room);
            player.name = playerName;
            socket.emit('room joined', room.id);
            break;
        }

        // 없다면 방 생성
        if (!player.room) {
            room = new Room();
            player.joinRoom(room);
            player.name = playerName;
            player.getOwner();
            socket.emit('room created', room.id);
        }
    })


    // 방 퇴장
    socket.on('exit room', () => {
        result = player.exitRoom();
        if (result === 'no join room') {
            socket.emit(result);
            return false;
        } else io.to(result.socketId).emit('owner change');
        
        socket.emit('room exited');
    })


    // Room 생성

    /**
    let PlayerRoomId = 0;
    let PlayerRoomNum;
    let PlayerName;

    socket.on('join room', function (PlayerData) {
        PlayerName = PlayerData.name;
        Player.Names[PlayerId] = PlayerName;
        if (PlayerData.roomId === "auto") {
            if (!PlayerData.newRoom) { // 자동매치인데 방이 존재하지 않거나 덜 찬 방이 존재하지 않는지 확인
                let mostRoomId = 0;
                for(i = 1; i < RoomMaxNum; i++){ // 참가하기에 적합한 방 찾기
                    if(Room.PlayerCounts[i] < 8 & Room.States[i] !== 0 & Room.States[i] !== 4 & Room.Password[i] === 0 & Room.PlayerCounts[i] > Room.PlayerCounts[mostRoomId]){
                        mostRoomId = i;
                    }
                }
                if(mostRoomId !== 0){
                    PlayerData.roomId = mostRoomId;
                }
                if(PlayerData.roomId === "auto"){ // 자동참가 할 수 있는 방이 없을때
                    PlayerData.newRoom = true;
                }
            }
        } else { // 선택매치
            let reason = -1;
            if (Room.PlayerCounts[PlayerData.roomId] === 0) { // 입력한 방이 존재하지않는경우
                reason = 0;
            } else if (Room.PlayerCounts[PlayerData.roomId] === 8) { // 입력한 방이 꽉찬경우
                reason = 1;
            } else if (Room.Password[PlayerData.roomId] !== PlayerData.password) { // 비밀번호 맞는지 확인. 없는건 둘다 0이기 때문에 조건 하나만 둬도 된다.
                reason = 2;
            }
            if(reason !== -1){
                io.to(socket.id).emit('no room', reason);
                return;
            }
        }
        let PlayingRoom = 0;
        if (PlayerData.newRoom) {
            if (Room.Count >= RoomMaxNum) { // 서버 방 생성 꽉참
                io.to(socket.id).emit('no room', 3);
                return;
            }
            Room.Count++
            PlayerRoomId = Room.States.indexOf(0);
            RoomMg.makeRoom(PlayerId, PlayerRoomId, PlayerData.password);
        } else {
            PlayerRoomId = PlayerData.roomId;
            RoomMg.joinRoom(PlayerId, PlayerRoomId);
            if(Room.States[PlayerData.roomId] === 3){
                PlayingRoom = 1;
            }
        }
        PlayerRoomNum = Player.RoomNums[PlayerId];
        io.to(socket.id).emit('join room', PlayerRoomId, Room.PlayerIds[PlayerRoomId], Room.PlayerCounts[PlayerRoomId], Room.PlayerNames[PlayerRoomId], Room.OwnerIds[PlayerRoomId], Room.MapId[PlayerRoomId], PlayingRoom);
        if(PlayingRoom === 1){ io.to(socket.id).emit('start game', Room.PlayerLiveStates[PlayerRoomId], Room.LiveCounts[PlayerRoomId], Room.PlayerXs[PlayerRoomId], Room.PlayerYs[PlayerRoomId], Room.PlayerSightRanges[PlayerRoomId], Room.TaggerIds[PlayerRoomId], Room.Map[PlayerRoomId]) }
        io.to(PlayerRoomId).emit('user join', PlayerId, PlayerName, PlayerRoomNum);
        socket.join(PlayerRoomId);
    })

    socket.on('exit room', function () {
        socket.leave(PlayerRoomId);
        if (Room.PlayerCounts[PlayerRoomId] < 2) { // 나간사람이 마지막 사람일 경우
            RoomMg.deleteRoom(PlayerRoomId);
            Player.Rooms[PlayerId] = 0;
        } else {
            RoomMg.exitRoom(PlayerId, PlayerRoomId);
            if (Room.OwnerIds[PlayerRoomId] === PlayerId) { // 나간사람이 방장인 경우
                Room.OwnerIds[PlayerRoomId] = Room.PlayerIds[PlayerRoomId].filter(id => id !== 0)[0];
                io.to(PlayerRoomId).emit('pass owner', Room.OwnerIds[PlayerRoomId]);
            }
            io.to(PlayerRoomId).emit('user exit', PlayerId);
        }
        PlayerRoomId = 0;
    })

    socket.on('pass owner', function (OwnerId) {
        Room.OwnerIds[PlayerRoomId] = OwnerId;
        io.to(PlayerRoomId).emit('pass owner', OwnerId);
    })

    socket.on('kick user', function (KickId) {
        RoomMg.exitRoom(KickId, PlayerRoomId);
        io.to(PlayerRoomId).emit('user exit', KickId);
        io.to(Player.SocketIds[KickId]).emit('kicked');
    })

    socket.on('kicked ok', function () { // kick user는 방장의 소켓이므로 킥 당한 사람으로부터 신호를 받는 작업이 필요함.
        socket.leave(PlayerRoomId);
        PlayerRoomId = 0;
    })

    socket.on('disconnect', function () {
        if (PlayerRoomId !== 0) {
            if (Room.PlayerCounts[PlayerRoomId] < 2) { // 나간사람이 마지막 사람일 경우
                RoomMg.deleteRoom(PlayerRoomId);
            } else {
                RoomMg.exitRoom(PlayerId, PlayerRoomId);
                if (Room.States[PlayerRoomId] === 3) { // 만약 게임중인 방이라면
                    if (Room.LiveCounts[PlayerRoomId] <= 2) { // 나가면 생존자가 2명만 남아서 이기는 경우
                        io.to(PlayerRoomId).emit('game over', [0,1,2,3,4,5,6,7].filter(index => Room.PlayerLiveStates[PlayerRoomId][index] === 1));
                        RoomMg.EndGame(PlayerRoomId);
                    } else if (Room.TaggerIds[PlayerRoomId] === PlayerId) { // 나간사람이 술래인 경우
                        const LiveRunners = [0,1,2,3,4,5,6,7].filter(index => Room.PlayerLiveStates[PlayerRoomId][index] === 1);
                        Room.TaggerIds[PlayerRoomId] = Room.PlayerIds[PlayerRoomId][LiveRunners[tool.getRandomNum(0, LiveRunners.length)]];
                        Room.TaggerChangeTime[PlayerRoomId] = Date.now();
                        io.to(PlayerRoomId).emit('change tagger', Room.TaggerIds[PlayerRoomId]);
                    }
                }
                if (Room.OwnerIds[PlayerRoomId] === PlayerId) { // 나간사람이 방장인 경우
                    Room.OwnerIds[PlayerRoomId] = Room.PlayerIds[PlayerRoomId].filter(id => id !== 0)[tool.getRandomNum(0, Room.PlayerCounts[PlayerRoomId])];
                    io.to(PlayerRoomId).emit('pass owner', Room.OwnerIds[PlayerRoomId]);
                }
                io.to(PlayerRoomId).emit('user exit', PlayerId);
            }
        }
        Player.States[PlayerId] = 0;
        Player.SocketIds[PlayerId] = undefined;
    })

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


httpServer.listen(port);