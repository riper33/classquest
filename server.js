/**
 * ClassQuest Multiplayer Real-Time Server
 * Menggabungkan Static HTTP Server & WebSocket Server untuk Live Game Room Kelas ala Quizizz.
 * Mendukung acak urutan soal (shuffle questions) dan acak pilihan jawaban (shuffle options) per siswa.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 5173;

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP Server
const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  const filePath = path.join(__dirname, reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// WebSocket Server attached to HTTP Server
const wss = new WebSocketServer({ server });

// Active Game Rooms Map: { roomCode: { hostWs, quizData, settings, players: Map(), status: 'lobby'|'playing'|'finished' } }
const rooms = new Map();

// Helper: Generate 6-digit room PIN
function generateRoomCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(code));
  return code;
}

// Helper: Fisher-Yates array shuffle
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Helper: Broadcast to everyone in a room
function broadcastToRoom(roomCode, data) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const msg = JSON.stringify(data);

  if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) {
    room.hostWs.send(msg);
  }

  room.players.forEach(p => {
    if (p.ws && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(msg);
    }
  });
}

// Helper: Send leaderboard update to room
function sendLeaderboardUpdate(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const playerList = Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    streak: p.streak,
    accuracy: p.totalAnswered > 0 ? Math.round((p.correctCount / p.totalAnswered) * 100) : 0,
    progress: `${p.currentQuestionIndex}/${room.quizData.questions.length}`,
    isFinished: p.isFinished
  }));

  playerList.sort((a, b) => b.score - a.score);

  broadcastToRoom(roomCode, {
    type: 'LEADERBOARD_UPDATE',
    leaderboard: playerList
  });
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  let currentRoomCode = null;
  let isHost = false;
  let playerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        // 1. GURU MEMBUAT ROOM
        case 'HOST_CREATE_ROOM': {
          const roomCode = generateRoomCode();
          currentRoomCode = roomCode;
          isHost = true;

          const settings = {
            shuffleQuestions: data.settings?.shuffleQuestions ?? true,
            shuffleOptions: data.settings?.shuffleOptions ?? true,
            timePerQuestion: data.settings?.timePerQuestion || 20
          };

          rooms.set(roomCode, {
            code: roomCode,
            hostWs: ws,
            quizData: data.quizData,
            settings: settings,
            players: new Map(),
            status: 'lobby'
          });

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            roomCode: roomCode,
            quizTitle: data.quizData.title,
            settings: settings,
            serverIPs: getLocalIPAddresses()
          }));
          break;
        }

        // 2. SISWA JOIN ROOM
        case 'PLAYER_JOIN': {
          const { roomCode, playerName, avatar } = data;
          const room = rooms.get(roomCode);

          if (!room) {
            ws.send(JSON.stringify({ type: 'JOIN_ERROR', message: 'Room PIN tidak ditemukan! Periksa kembali kodenya.' }));
            return;
          }

          if (room.status !== 'lobby') {
            ws.send(JSON.stringify({ type: 'JOIN_ERROR', message: 'Game sudah dimulai atau selesai di room ini!' }));
            return;
          }

          currentRoomCode = roomCode;
          playerId = 'p_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

          const playerObj = {
            id: playerId,
            ws: ws,
            name: playerName.trim() || 'Peserta',
            avatar: avatar,
            score: 0,
            streak: 0,
            correctCount: 0,
            totalAnswered: 0,
            currentQuestionIndex: 0,
            isFinished: false
          };

          room.players.set(playerId, playerObj);

          ws.send(JSON.stringify({
            type: 'JOINED_SUCCESS',
            playerId: playerId,
            roomCode: roomCode,
            quizTitle: room.quizData.title,
            totalQuestions: room.quizData.questions.length
          }));

          // Broadcast daftar siswa di lobby ke Host & semua siswa
          const lobbyPlayers = Array.from(room.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar
          }));

          broadcastToRoom(roomCode, {
            type: 'LOBBY_PLAYERS_UPDATE',
            players: lobbyPlayers,
            totalJoined: lobbyPlayers.length
          });
          break;
        }

        // 3. GURU MEMULAI GAME (START)
        case 'HOST_START_GAME': {
          const room = rooms.get(currentRoomCode);
          if (!room || !isHost) return;

          room.status = 'playing';

          // Untuk setiap siswa: siapkan kumpulan soal dengan acak urutan & acak opsi!
          room.players.forEach(p => {
            let studentQuestions = [...room.quizData.questions];

            // A. FITUR ACAK SOAL (Shuffle Questions) jika diaktifkan guru
            if (room.settings.shuffleQuestions) {
              studentQuestions = shuffleArray(studentQuestions);
            }

            // B. FITUR ACAK PILIHAN JAWABAN (Shuffle Options) jika diaktifkan guru
            const preparedQuestions = studentQuestions.map((q, idx) => {
              let options = [...q.options];
              if (room.settings.shuffleOptions) {
                options = shuffleArray(options);
              }
              return {
                id: q.id,
                orderNum: idx + 1,
                text: q.text,
                options: options,
                hint: q.hint || '',
                explanation: q.explanation || '',
                points: q.points || 1000,
                correctOptionId: q.correctOptionId // Untuk verifikasi di klien
              };
            });

            if (p.ws && p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({
                type: 'GAME_STARTED',
                questions: preparedQuestions,
                timePerQuestion: room.settings.timePerQuestion,
                settings: room.settings
              }));
            }
          });

          // Host juga menerima pemberitahuan bahwa game telah dimulai
          if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) {
            room.hostWs.send(JSON.stringify({
              type: 'GAME_STARTED_FOR_HOST',
              totalQuestions: room.quizData.questions.length,
              playerCount: room.players.size
            }));
          }

          sendLeaderboardUpdate(currentRoomCode);
          break;
        }

        // 4. SISWA SUBMIT JAWABAN
        case 'PLAYER_SUBMIT_ANSWER': {
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const player = room.players.get(playerId);
          if (!player) return;

          const { isCorrect, pointsEarned, streak, isFinished } = data;

          player.totalAnswered += 1;
          player.currentQuestionIndex += 1;
          player.streak = streak;

          if (isCorrect) {
            player.correctCount += 1;
            player.score += pointsEarned;
          }

          if (isFinished) {
            player.isFinished = true;
          }

          // Broadcast real-time leaderboard update
          sendLeaderboardUpdate(currentRoomCode);

          // Cek apakah semua siswa sudah selesai menjawab semua soal
          let allFinished = true;
          room.players.forEach(p => {
            if (!p.isFinished) allFinished = false;
          });

          if (allFinished && room.players.size > 0 && room.status === 'playing') {
            room.status = 'finished';
            broadcastToRoom(currentRoomCode, {
              type: 'ALL_PLAYERS_FINISHED'
            });
          }
          break;
        }

        // 5. HOST SELESAIKAN GAME SECARA MANUAL
        case 'HOST_END_GAME': {
          const room = rooms.get(currentRoomCode);
          if (!room || !isHost) return;

          room.status = 'finished';
          broadcastToRoom(currentRoomCode, {
            type: 'ALL_PLAYERS_FINISHED'
          });
          break;
        }
      }
    } catch (e) {
      console.error('WebSocket Message Error:', e);
    }
  });

  // Client Disconnect Handler
  ws.on('close', () => {
    if (currentRoomCode && rooms.has(currentRoomCode)) {
      const room = rooms.get(currentRoomCode);
      if (isHost) {
        // Jika Host keluar, beritahu semua siswa
        broadcastToRoom(currentRoomCode, {
          type: 'HOST_DISCONNECTED',
          message: 'Guru / Host telah menutup ruangan kuis.'
        });
        rooms.delete(currentRoomCode);
      } else if (playerId && room.players.has(playerId)) {
        room.players.delete(playerId);
        sendLeaderboardUpdate(currentRoomCode);

        // Update list lobby jika masih di lobby
        if (room.status === 'lobby') {
          const lobbyPlayers = Array.from(room.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar
          }));
          broadcastToRoom(currentRoomCode, {
            type: 'LOBBY_PLAYERS_UPDATE',
            players: lobbyPlayers,
            totalJoined: lobbyPlayers.length
          });
        }
      }
    }
  });
});

// Helper: Cari IP Address Lokal di Jaringan WiFi
function getLocalIPAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIPAddresses();
  console.log('========================================================');
  console.log('⚡ CLASSQUEST MULTIPLAYER ONLINE SERVER BERJALAN!');
  console.log(`💻 Buka di Laptop Host/Guru:   http://localhost:${PORT}`);
  if (localIPs.length > 0) {
    localIPs.forEach(ip => {
      console.log(`📱 Buka di HP/Laptop Siswa:     http://${ip}:${PORT}`);
    });
  }
  console.log('========================================================');
});
