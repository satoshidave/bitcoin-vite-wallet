import type { BIP32Interface } from 'bip32';
import type { Network } from 'bitcoinjs-lib';
import { create } from 'zustand';
import { bitcoin } from '../config';

// TODO: mas adelante se encriptará la masterKey,
// y se agregarán estados de autenticación
const useStore = create((set) => ({
	masterKey: null,
	network: bitcoin.networks.bitcoin,
	setMasterKey: (masterKey: BIP32Interface) => set({ masterKey }),
	setNetwork: (network: Network) => set({ network }),
}));

export default useStore;
