import { FirebaseOptions, getApp, initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import { firebaseConfig } from './firebaseconfig';

const createFirebaseApp = (config: FirebaseOptions) => {
  try{
    return getApp();
  } catch {
    return initializeApp(config)
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig)

const firestore = getFirestore(firebaseApp);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    }
  ],
  iceCandidatePoolSize: 10,
}

const pc = new RTCPeerConnection(servers)

export { servers, firestore, pc }
