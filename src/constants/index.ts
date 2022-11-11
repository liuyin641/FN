import { AbstractConnector } from '@web3-react/abstract-connector'
import { Token } from './token'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BAST_TOKEN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.ROPSTEN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.RINKEBY]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.GÖRLI]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.KOVAN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT'),
  [ChainId.BSCTEST]: new Token(ChainId.BSCTEST, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT')
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

export const NODE_SALE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'USDT',
  [ChainId.ROPSTEN]: 'USDT',
  [ChainId.RINKEBY]: 'USDT',
  [ChainId.GÖRLI]: 'USDT',
  [ChainId.KOVAN]: 'USDT',
  [ChainId.BSC]: '0xD413e3660b11003B1536d1dE5CB0d5629E1373Fa',
  [ChainId.BSCTEST]: '0xdb03De579620C6aFF23aBe7051E3859b92074970'
}

export const NODE_DIVIDEND_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'USDT',
  [ChainId.ROPSTEN]: 'USDT',
  [ChainId.RINKEBY]: 'USDT',
  [ChainId.GÖRLI]: 'USDT',
  [ChainId.KOVAN]: 'USDT',
  [ChainId.BSC]: '0x61Ccd7bD965FDeAaC9e87f67d6D5ff9BA0Ce198d',
  [ChainId.BSCTEST]: '0x04D3bd77E1FE9eF5cf9cE1843cbD2727A4AeDc14'
}

export const EARN_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'USDT',
  [ChainId.ROPSTEN]: 'USDT',
  [ChainId.RINKEBY]: 'USDT',
  [ChainId.GÖRLI]: 'USDT',
  [ChainId.KOVAN]: 'USDT',
  [ChainId.BSC]: '0x1188B6BF67A11B1bc513b0282df33Be93d801041',
  [ChainId.BSCTEST]: '0xA0c173130E4F391cb748460a3CB80E3B882009D1'
}

export const LIVE_EARN_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'USDT',
  [ChainId.ROPSTEN]: 'USDT',
  [ChainId.RINKEBY]: 'USDT',
  [ChainId.GÖRLI]: 'USDT',
  [ChainId.KOVAN]: 'USDT',
  [ChainId.BSC]: '0xFE55a4bC6b824b4231A386B201163800217578C1',
  [ChainId.BSCTEST]: '0xF633561E7f91Cd337bBF82510f499D5661d81FEB'
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.ROPSTEN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.RINKEBY]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.GÖRLI]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.KOVAN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'MATTER', 'Matter'),
  [ChainId.BSCTEST]: new Token(ChainId.BSCTEST, '0xFd8755535B187Da3c0653c450641180382C75521', 18, 'USDT', 'USDT')
}

export const FN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.ROPSTEN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.RINKEBY]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.GÖRLI]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.KOVAN]: new Token(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'MATTER', 'Matter'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0xc60CB42B0db6041A117BFe7345e2f62339d6221C', 18, 'MATTER', 'Matter'),
  [ChainId.BSCTEST]: new Token(ChainId.BSCTEST, '0x61EA09a50883658B2093426628D87b07f01Aa624', 18, 'USDT', 'USDT')
}

export const FIRST_ADDRESS = '0x7C2eDB42774b71D85569d5cd3B9d5C5a9481Bf19'
