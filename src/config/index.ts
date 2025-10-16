import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as secp256k1 from 'tiny-secp256k1';
import ECPairFactory from 'ecpair'; // ecpair ahora es un módulo independiente de secp256k1
import { Buffer } from 'buffer'; // Buffer es necesario para que ecpair funcione correctamente

if (typeof (window as any).Buffer === 'undefined') {
	(window as any).Buffer = Buffer;
}

// Se inicializa el modulo bip32 con la implementación de tiny-secp256k1
const bip32 = BIP32Factory(secp256k1);
const ECPair = ECPairFactory(secp256k1);

// Se define la red. Testnet para pruebas, y bitcoin para mainnet
const network = bitcoin.networks.testnet;

export { bip39, bip32, network, bitcoin, ECPair };
