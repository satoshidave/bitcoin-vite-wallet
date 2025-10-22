import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { generateWallet } from './functions/wallet';
import { deriveAddresses } from './functions/addresses';
import { createTransaction } from './functions/transaction';
import { mockUtxos } from './examples/mockTx';
import { verifyTransaction } from './functions/verification';
import { recoverWallet } from './functions/recovery';
import { discoverUsedAdresses } from './functions/discover';

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		(async () => {
			const passphrase = '';
			// Aqui se están haciendo las pruebas por mientras
			const wallet = generateWallet({ words: 24, passphrase });
			console.log('Generated Wallet (from App.tsx):', wallet);

			const addresses = deriveAddresses({ masterKey: wallet.masterKey });
			console.log('Generated Addresses (from App.tsx):', addresses);

			const transaction = await createTransaction({
				fromAddress: addresses[0].address,
				toAddress: 'tb1q4kgratttzjvkxfmgd95z54qcq7y6hekdm3w56u',
				amount: 50000, // 0.0005 BTC
				utxos: mockUtxos, // value en bigint
				privateKey: addresses[0].privateKey, // corresponde a fromAddress
			});
			console.log('Generated Transaction (from App.tsx):', transaction);

			await verifyTransaction({
				txHex: transaction.txHex,
			});

			recoverWallet({ mnemonic: wallet.mnemonic, passphrase });

			const usedAddresses = await discoverUsedAdresses({
				masterKey: wallet.masterKey,
			});
			console.log('Used addresses:', usedAddresses);
		})();
	}, []);

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
