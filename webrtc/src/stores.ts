import { type Writable, writable } from 'svelte/store';

export const webcamActive: Writable<boolean> = writable(false)
export const callId: Writable<string> = writable('')
