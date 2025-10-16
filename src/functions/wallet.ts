import { bip32, bip39, network } from '../config';

interface Wallet {
	words: 12 | 24;
	passphrase: string;
}

export const generateWallet = ({ words = 12, passphrase = '' }: Wallet) => {
	// Aqui generamos las frases semillas usando el standard BIP39.
	// Recibe como parámetro el número de palabras deseado, donde solo 12 y 24 son las opciones disponibles
	const mnemonic = bip39.generateMnemonic(words * (32 / 3));
	console.log('Seed phrase: ', mnemonic);

	// Y aqui se crea la semilla, donde la passphrase es un campo opcional
	const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);

	// Aqui se crea la llave maestra a partir de la semilla
	const masterKey = bip32.fromSeed(seed, network);

	return {
		mnemonic,
		masterKey,
		seed: seed.toString('hex'),
	};
};

//export const wallet = generateWallet();
