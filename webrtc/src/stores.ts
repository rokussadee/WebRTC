import { type Writable, writable } from 'svelte/store';

export const webcamActive: Writable<boolean> = writable(false)
