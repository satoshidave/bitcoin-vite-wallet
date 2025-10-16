# Bitcoin Vite Wallet (Prototype)

Un prototipo sencillo de cartera Bitcoin en TypeScript + React (Vite). Base mínima para derivar direcciones HD, construir y firmar transacciones con PSBT y verificar transacciones desde su hex. A futuro evolucionará con interfaz gráfica y nuevas funcionalidades.

---

## Características

-   Derivación HD de direcciones (BIP44)
-   Direcciones Native SegWit (P2WPKH)
-   Construcción y firma de transacciones con PSBT (bitcoinjs-lib)
-   Verificación de transacciones desde txHex
-   Mocks y utilidades para pruebas locales
-   Muchos console.log (de momento)

---

## Requisitos

-   Node.js (recomendado v16+)
-   npm o yarn

---

## Instalación rápida

```bash
git clone <repo-url>
cd react-bitcoin-wallet
npm install
npm run dev
```
