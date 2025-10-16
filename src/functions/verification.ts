import { size } from 'lodash';
import { bitcoin } from '../config';

export const verifyTransaction = ({ txHex }: { txHex: string }) => {
	try {
		// Se parsea el hex de la transacción para obtener los detalles
		const transaction = bitcoin.Transaction.fromHex(txHex);

		// Mas adelante se puede agregar el fee u otro dato
		const validation = {
			hasInputs: size(transaction.ins) > 0,
			hasOutputs: size(transaction.outs) > 0,
			validSize: transaction.byteLength() <= 100000,
			txId: transaction.getId(),
			txSize: transaction.byteLength(),
		};

		console.log('Transaction verification:', validation);

		return validation;
	} catch (error) {
		console.log('Error verifying transaction:', error.message);
		return false;
	}
};
