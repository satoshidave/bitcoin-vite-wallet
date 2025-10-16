import { bitcoin, network } from '../config';
import type { BIP32Interface } from 'bip32';

interface DeriveAddresses {
	masterKey: BIP32Interface;
	accountIndex?: number;
	numAddresses?: number;
	addressIndex?: number;
}

export const deriveAddresses = ({
	masterKey,
	accountIndex = 0,
	numAddresses = 5,
	addressIndex = 0,
}: DeriveAddresses) => {
	const addresses = [];

	// Se definen las rutas de derivación. 1 para testnet, 0 para mainnet
	const pathType = network === bitcoin.networks.testnet ? 1 : 0;
	const basePath = `m/44'/${pathType}'/${accountIndex}'/0`;

	// Se generarán tantas direcciones con sus llaves hijas, como se haya definido en numAddresses
	for (let i = 0; i < numAddresses; i++) {
		const startIndex = addressIndex + i;
		const path = `${basePath}/${startIndex}`;
		const child = masterKey.derivePath(path);

		// Aquí se genea una dirección Native Segwit
		const { address } = bitcoin.payments.p2wpkh({
			pubkey: child.publicKey,
			network,
		});

		// Y se agrega a la lista de direcciones
		addresses.push({
			index: startIndex,
			path,
			address,
			privateKey: child.toWIF(),
			publicKey: child.publicKey.toString('hex'),
		});
	}

	return addresses;
};
