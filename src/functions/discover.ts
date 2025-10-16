import type { BIP32Interface } from 'bip32';
import { deriveAddresses } from './addresses';

interface Discover {
	masterKey: BIP32Interface;
	maxGap?: number;
	maxInterations?: number;
}

const checkActivity = (address: string) => {
	// Change for validate with blockchain API
	return Math.random() > 0.8;
};

export const discoverUsedAdresses = ({
	masterKey,
	maxGap = 20,
	maxInterations = 10000, // Evita que haya un bucle infinito de búsqueda de direcciones
}: Discover) => {
	const usedAddresses = [];
	let consecutiveEmpty = 0;
	let addressIndex = 0;
	let interations = 0;

	while (consecutiveEmpty < maxGap) {
		if (interations >= maxInterations) {
			// Se puede cambiar por un mensaje de error o por otra acción. Por ahora se retorna las direcciones usadas.
			return usedAddresses;
		}

		const addresses = deriveAddresses({
			masterKey,
			accountIndex: 0,
			numAddresses: 1,
			addressIndex,
		});
		const address = addresses[0];

		const hasActivity = checkActivity(address.address);

		if (hasActivity) {
			usedAddresses.push(address);
			consecutiveEmpty = 0;
		} else {
			consecutiveEmpty++;
		}

		interations++;
		addressIndex++;
	}

	return usedAddresses;
};
