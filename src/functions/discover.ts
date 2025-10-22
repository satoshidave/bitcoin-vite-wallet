import type { BIP32Interface } from 'bip32';
import { deriveAddresses } from './addresses';
import axios from 'axios';
import { blockchainServer } from '../config';
import { forEach, get, map, size } from 'lodash';

interface Discover {
	masterKey: BIP32Interface;
	maxGap?: number;
	maxInterations?: number;
}

// De ser necesario, se irá agregando nuevos campos
type MempoolTx = {
	fee: number;
	size: number;
	status: {
		block_hash: string;
		block_height: number;
		block_time: number;
		confirmed: boolean;
	};
	txid: string;
	voud: {
		scriptpubkey_address: string;
		value: number;
	};
};

const queryAddressData = async (address: string) => {
	const request = await axios.get(
		`https://mempool.space/testnet/api/address/${address}/txs`,
		{ timeout: 5000 }
	);
	console.log(request);
	return {
		request,
		address,
	};
};

export const discoverUsedAdresses = async ({
	masterKey,
	maxGap = 20,
	maxInterations = 10000, // Evita que haya un bucle infinito de búsqueda de direcciones
}: Discover) => {
	const usedAddresses: { request: { data: MempoolTx[] }; address: string }[] =
		[];
	let consecutiveEmpty = 0;
	let addressIndex = 0;
	let interations = 0;

	const addresses = deriveAddresses({
		masterKey,
		accountIndex: 0,
		numAddresses: 100, // Busca N direcciones
		addressIndex, // Posición desde la cual se busca
	});

	const requests = map(addresses, ({ address }) => queryAddressData(address));
	const responses = await Promise.all(requests);

	forEach(responses, (response) => {
		// Esto evita que siga buscando direcciones vacias si son consecutivas mayores al maxGap
		if (consecutiveEmpty >= maxGap) return;
		// De lo contrario continuará examinando y agregando direcciones usadas
		if (size(get(response, 'request.data', [])) > 0) {
			usedAddresses.push(response);
			consecutiveEmpty = 0;
		} else {
			consecutiveEmpty++;
		}
	});

	return usedAddresses;
};
