import { size } from 'lodash';
import { bitcoin, ECPair, network } from '../config';

interface Transaction {
	fromAddress: string;
	toAddress: string;
	amount: number;
	utxos: any[];
	privateKey: string;
}

export const createTransaction = async ({
	fromAddress,
	toAddress,
	amount,
	utxos,
	privateKey,
}: Transaction) => {
	const psbt = new bitcoin.Psbt({ network });

	let totalInput = 0;

	// Añade tantos inputs como UTXOs haya
	for (const utxo of utxos) {
		const scriptPreBuffer = bitcoin.address.toOutputScript(
			fromAddress,
			network
		);
		const script =
			scriptPreBuffer instanceof Uint8Array
				? scriptPreBuffer
				: Uint8Array.from(scriptPreBuffer);
		const value = BigInt(utxo.value);

		psbt.addInput({
			hash: utxo.txid,
			index: utxo.vout,
			witnessUtxo: {
				script,
				value,
			},
		});

		totalInput += utxo.value;
	}

	// Se calcula el fee. De momento es de 1000 satoshis, pero a futuro lo obtendrá de una API
	const fee = 1000;
	const changeAmount = totalInput - amount - fee;

	// Se añade la salida al destinatario
	psbt.addOutput({
		address: toAddress,
		value: BigInt(amount),
	});

	// Aquí se le da el vuelto de los satoshis sobrantes a quien envía (si el vuelto es mayor a 546 satoshis)
	if (changeAmount > 546) {
		// Dust threshold
		psbt.addOutput({
			address: fromAddress,
			value: BigInt(changeAmount),
		});
	}

	// Se firman todas las entradas
	const keyPair = ECPair.fromWIF(privateKey, network);
	for (let i = 0; i < size(utxos); i++) {
		psbt.signInput(i, keyPair);
	}

	// Se finaliza y se extrae la transacción
	psbt.finalizeAllInputs();
	const transaction = psbt.extractTransaction();

	return {
		txHex: transaction.toHex(),
		txId: transaction.getId(),
		size: transaction.byteLength(),
		fee,
	};
};
