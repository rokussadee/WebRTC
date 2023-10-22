import {v4 as uuidv4} from 'uuid';
import type { Socket } from 'socket.io';

let lastCreatedRoomID: string | null  = null;

let roomData: any = {}

function createNewRoom(socket: Socket) {
  //create room-id
  const room_id = uuidv4()
  lastCreatedRoomID = room_id;
  roomData[room_id] = {users: []}
  console.log(`new room with id ${lastCreatedRoomID} got created by user with id ${socket.id}`)
}

function joinLastCreatedRoom(socket: Socket) {
  if (lastCreatedRoomID) {
    socket.join(lastCreatedRoomID);
    console.log(`user with socket id ${socket.id} joined room ${lastCreatedRoomID}`)
    return lastCreatedRoomID
  }
}

function linkUserToRoom(room_id: number, user_db_id: number) {
  console.log(roomData)
  console.log(roomData[room_id].users)
  roomData[room_id]['users'].push(user_db_id)
}

export {
  createNewRoom,
  joinLastCreatedRoom,
  lastCreatedRoomID,
  linkUserToRoom
}
