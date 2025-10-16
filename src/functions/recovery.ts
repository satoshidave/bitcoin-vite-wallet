import { bip32, bip39, network } from '../config';
import { deriveAddresses } from './addresses';

interface Recovery {
	mnemonic: string;
	passphrase?: string;
}

export const recoverWallet = ({ mnemonic, passphrase = '' }: Recovery) => {
	try {
		// Se validan las frases mnemonicas
		if (!bip39.validateMnemonic(mnemonic))
			throw new Error('Invalid mnemonic');

		// Y se genera la semilla a partir de las frases
		const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);

		// Se restaura la llave maestra
		const masterKey = bip32.fromSeed(seed, network);

		// Se deriva la primera dirección para verificar
		const firstAddress = deriveAddresses({
			masterKey,
			accountIndex: 0,
			numAddresses: 1,
		})[0];

		console.log('Wallet recovered successfully');
		console.log('First address: ', firstAddress.address);

		return {
			mnemonic,
			masterKey,
			firstAddress: firstAddress.address,
		};
	} catch (error) {
		console.log('Error recovering wallet:', error.message);
		return false;
	}
};
