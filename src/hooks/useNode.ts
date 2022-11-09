import { useEarnContract, useNodeContract, useNodeRewardsContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { FIRST_ADDRESS, ZERO_ADDRESS } from '../constants'
import { CurrencyAmount } from '../constants/token'
import JSBI from 'jsbi'
import { useI18n } from 'react-simple-i18n'

export function useNodeInfo() {
  const { account } = useActiveWeb3React()
  const contract = useNodeContract()
  const infoRes = useSingleCallResult(contract, 'userInfo', [account ?? undefined])
  const nodeCountRes = useSingleCallResult(contract, 'nodeCount')
  return useMemo(() => {
    return {
      isNode: infoRes?.result ? infoRes.result.isNode : true,
      reward: infoRes?.result ? CurrencyAmount.ether(infoRes.result.reward.toString()) : undefined,
      subordinates: infoRes?.result ? infoRes.result.subordinates.toString() : undefined,
      inviter: infoRes?.result ? infoRes.result.inviter : ZERO_ADDRESS,
      nodeCount: nodeCountRes?.result?.[0] ?? undefined
    }
  }, [infoRes.result, nodeCountRes?.result])
}

export function useIsNode(address: string | undefined) {
  const contract = useNodeContract()
  const inputs = [address && isAddress(address) ? address : undefined]
  const infoRes = useSingleCallResult(contract, 'userInfo', inputs)
  return useMemo(() => {
    if (isAddress(FIRST_ADDRESS) === isAddress(address)) {
      return { ableNode: true }
    }
    return {
      ableNode: infoRes?.result ? infoRes.result.isNode : false
    }
  }, [address, infoRes.result])
}

export function useAbleEarnAddress(address: string | undefined) {
  const contract = useEarnContract({ isLive: false })
  const inputs = [address && isAddress(address) ? address : undefined]
  const infoRes = useSingleCallResult(contract, 'userInfo', inputs)
  return useMemo(() => {
    if (isAddress(FIRST_ADDRESS) === isAddress(address)) {
      return { ableAddress: true }
    }
    return {
      ableAddress: infoRes?.result ? infoRes.result.isNode : false
    }
  }, [address, infoRes.result])
}

export function useNodeRewards() {
  const { account } = useActiveWeb3React()
  const contract = useNodeRewardsContract()
  const totalRewardsRes = useSingleCallResult(contract, 'totalRewards')
  const rewardPerRes = useSingleCallResult(contract, 'accRewardPerShare')
  const rewardRes = useSingleCallResult(contract, 'withdrawableReward', [account ?? undefined])
  const infoRes = useSingleCallResult(contract, 'userInfo', [account ?? undefined])

  return useMemo(() => {
    return {
      totalRewards: totalRewardsRes?.result ? CurrencyAmount.ether(totalRewardsRes?.result?.[0].toString()) : undefined,
      rewardPer: rewardPerRes?.result ? CurrencyAmount.ether(rewardPerRes?.result?.[0].toString()) : undefined,
      rewards: rewardRes?.result ? CurrencyAmount.ether(rewardRes?.result?.[0].toString()) : undefined,
      claimedRewards: infoRes?.result ? CurrencyAmount.ether(infoRes.result.realizedReward) : undefined
    }
  }, [infoRes.result, rewardPerRes?.result, rewardRes?.result, totalRewardsRes?.result])
}

export function useEarnInfo({ isLive }: { isLive: boolean }) {
  const { account } = useActiveWeb3React()
  const contract = useEarnContract({ isLive })
  const totalSupplyRes = useSingleCallResult(contract, 'totalSupply')
  const rewardInfoRes = useSingleCallResult(contract, 'rewardTokenInfo')
  const balanceRes = useSingleCallResult(contract, 'balanceOf', [account ?? undefined])
  const rewardRes = useSingleCallResult(contract, 'getPendingReward', [account ?? undefined])
  return useMemo(() => {
    return {
      balance: balanceRes?.result ? CurrencyAmount.ether(balanceRes?.result?.[0].toString()) : undefined,
      rewards: rewardRes?.result ? CurrencyAmount.ether(rewardRes?.result?.[0].toString()) : undefined,
      apy:
        totalSupplyRes?.result && rewardInfoRes?.result
          ? JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt('1051200000'),
                JSBI.multiply(JSBI.BigInt(1000000000000000000), JSBI.BigInt(rewardInfoRes?.result?.rewardPerBlock))
              ),
              JSBI.BigInt(totalSupplyRes?.result?.[0])
            )
          : undefined
    }
  }, [balanceRes?.result, rewardInfoRes?.result, rewardRes?.result, totalSupplyRes?.result])
}

export function useDealEarn() {
  const { account } = useActiveWeb3React()
  const contract = useEarnContract({ isLive: false })
  const infoRes = useSingleCallResult(contract, 'userInfo', [account ?? undefined])
  return useMemo(() => {
    return {
      rewards: infoRes?.result ? CurrencyAmount.ether(infoRes.result.userRewards) : undefined,
      subordinatesL1: infoRes?.result ? infoRes.result.subordinatesL1 : undefined,
      subordinatesL2: infoRes?.result ? infoRes.result.subordinatesL2 : undefined,
      inviter: infoRes?.result ? infoRes.result.inviter : ZERO_ADDRESS
    }
  }, [infoRes.result])
}

export function useBuy() {
  const addTransaction = useTransactionAdder()
  const contract = useNodeContract()
  const { account } = useActiveWeb3React()
  const { t } = useI18n()
  const buy = useCallback(
    async (inviter: string | undefined) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [isAddress(inviter) ? inviter : ZERO_ADDRESS]
      const method = 'buy'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('buy')
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract, t]
  )

  return {
    buy
  }
}

export function useEarn({ isLive }: { isLive: boolean }) {
  const { t } = useI18n()
  const addTransaction = useTransactionAdder()
  const contract = useEarnContract({ isLive })
  const { account } = useActiveWeb3React()
  const earn = useCallback(
    async (amount: CurrencyAmount, inviter: string | undefined) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      if (amount.equalTo(JSBI.BigInt('0'))) throw new Error('amount is un support')
      const args = isLive
        ? [amount.raw.toString()]
        : [isAddress(inviter) ? inviter : ZERO_ADDRESS, amount.raw.toString()]
      const method = 'deposit'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `${t('save')}${amount.toSignificant(6, { groupSeparator: ',' })}`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract, isLive, t]
  )

  return {
    earn
  }
}

export function useWithdraw() {
  const addTransaction = useTransactionAdder()
  const dealContract = useEarnContract({ isLive: false })
  const liveContract = useEarnContract({ isLive: true })
  const { account } = useActiveWeb3React()
  const { t } = useI18n()
  const withdraw = useCallback(
    async (isLive: boolean) => {
      const contract = isLive ? liveContract : dealContract
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const method = 'withdraw'
      console.log('🚀 ~ file: useBuyBong.ts ~ line 18 ~ args', method)
      return contract.estimateGas[method]({ from: account, value: '3000000000000000' }).then(estimatedGasLimit => {
        return contract[method]({
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account,
          value: '3000000000000000'
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('withdraw')
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, dealContract, liveContract, t]
  )

  return {
    withdraw
  }
}

export function useClaim() {
  const addTransaction = useTransactionAdder()
  const dealContract = useEarnContract({ isLive: false })
  const liveContract = useEarnContract({ isLive: true })
  const { account } = useActiveWeb3React()
  const { t } = useI18n()
  const claim = useCallback(
    async (isLive: boolean) => {
      const contract = isLive ? liveContract : dealContract
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const method = 'claimReward'
      console.log('🚀 ~ file: claimReward.ts ~ line 18 ~ args', method)
      return contract.estimateGas[method]({ from: account, value: '3000000000000000' }).then(estimatedGasLimit => {
        return contract[method]({
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account,
          value: '3000000000000000'
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('claim')
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, dealContract, liveContract, t]
  )

  return {
    claim
  }
}

export function useClaimNodeRewards() {
  const addTransaction = useTransactionAdder()
  const contract = useNodeRewardsContract()
  const { account } = useActiveWeb3React()
  const { t } = useI18n()
  const claim = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    const method = 'withdrawReward'
    console.log('🚀 ~ file: claimReward.ts ~ line 18 ~ args', method)
    return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
      return contract[method]({
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: t('claim')
        })
        return response.hash
      })
    })
  }, [account, addTransaction, contract, t])

  return {
    claim
  }
}
