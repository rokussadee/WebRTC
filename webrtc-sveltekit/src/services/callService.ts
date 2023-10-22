import type {  QuerySnapshot, DocumentChange, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import {collection, doc, addDoc, setDoc, onSnapshot, getDoc, updateDoc} from 'firebase/firestore';
import {pc, firestore} from '../firebase';
import { callId } from '../stores';

export const callService = {
  async initiateCall(roomId: string) {
    console.log('call initiated')
    const callCollection = collection(firestore, 'calls')
//    const callDocRef = await addDoc(callCollection, {})
    const callDocRef = doc(callCollection, roomId)

    const offerCandidatesCollection = collection(callDocRef,  'offerCandidates')
    const answerCandidatesCollection = collection(callDocRef,  'answerCandidates')

    console.log(callDocRef.id, roomId)
    callId.set(callDocRef.id)

    pc.onicecandidate = (event:any) => {
      event.candidate && addDoc(offerCandidatesCollection, event.candidate.toJSON())
    }

    const offerDescription = await pc.createOffer()
    await pc.setLocalDescription(offerDescription)

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type
    }

    await setDoc(callDocRef, {offer})

    // Listener event that hits on firestore changes
    // Negotiates the initial connection
    onSnapshot(callDocRef, (snapshot: DocumentSnapshot<DocumentData>) => {
        console.log('ln 46:', snapshot)
        const data = snapshot.data()
        // If the current peer connection doesn't have a remote description yet, but data has an answer
          console.log('data?.answer: ', data?.answer)
        if(!pc.currentRemoteDescription && data?.answer) {
          console.log('data?.answer: ', data?.answer)
          const answerDescription = new RTCSessionDescription(data.answer)
          pc.setRemoteDescription(answerDescription)
        }
        
    })

    // Listener event that hits on ice candidates from the answering user (updates to the answerCandidates collection)
    onSnapshot(answerCandidatesCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach((change: DocumentChange<DocumentData>) => {
        console.log('ln 60:',change.type)
        if(change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.addIceCandidate(candidate)
        }
      });
    })
  },

  async answerCall(roomId: string) {
    const callCollection = collection(firestore, 'calls')
    const callDocRef = doc(callCollection, roomId)

    console.log('calldockref id and roomid',callDocRef.id, roomId)
    callId.set(callDocRef.id)

    const offerCandidatesCollection = collection(callDocRef,  'offerCandidates')
    const answerCandidatesCollection = collection(callDocRef,  'answerCandidates')

    pc.onicecandidate = (event: any) => {
      event.candidate && addDoc(answerCandidatesCollection, event.candidate.toJSON())
    }

    const callDoc = await getDoc(callDocRef)
    const offer = callDoc.data()?.offer

    await pc.setRemoteDescription(new RTCSessionDescription(offer))

    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type
    }

    await updateDoc(callDocRef, {answer})

    onSnapshot(offerCandidatesCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      snapshot.docChanges().forEach((change: DocumentChange<DocumentData>) => {
        console.log('ln 97',change.type)
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
      })
      
    }) 
  }
}
