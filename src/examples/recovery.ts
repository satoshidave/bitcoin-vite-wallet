import { recoverWallet } from '../functions/recovery';

const testMnemonic =
	'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const recoveredWallet = recoverWallet(testMnemonic);
