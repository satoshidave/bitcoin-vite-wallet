import type { BIP32Interface } from 'bip32';
import { create } from 'zustand';

const useStore = create((set) => ({
	masterKey: null,
	setMasterKey: (masterKey: BIP32Interface) => set({ masterKey }),
}));

export default useStore;
