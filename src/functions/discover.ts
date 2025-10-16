import { deriveAddresses } from './addresses';

const checkActivity = (address) => {
	// Change for validate with blockchain API
	return Math.random() > 0.8;
};

export const discoverUsedAdresses = (masterKey, maxGap = 20) => {
	const usedAddresses = [];
	let consecutiveEmpty = 0;
	let addressIndex = 0;

	while (consecutiveEmpty < maxGap) {
		const addresses = deriveAddresses(masterKey, 0, 1);
		const address = addresses[0];

		const hasActivity = checkActivity(address.address);

		if (hasActivity) {
			usedAddresses.push(address);
			consecutiveEmpty = 0;
		} else {
			consecutiveEmpty++;
		}

		addressIndex++;
	}

	return usedAddresses;
};
