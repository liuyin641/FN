import { Button, Stack, styled, Typography } from '@mui/material'
import Image from '../../components/Image'
import earnBanner from '../../assets/images/earn-banner.png'
import earnBannerEN from '../../assets/images/earn-banner-en.png'
import Divider from '../../components/Divider'
import { isMobile } from 'react-device-detect'
import ActionButton from '../../components/Button/ActionButton'
import fnImg from '../../assets/images/fn.png'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import NumericalInput from 'components/Input/InputNumerical'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useCallback, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { CurrencyAmount, TokenAmount } from '../../constants/token'
import { tryParseAmount } from '../../utils/parseAmount'
import { EARN_ADDRESS, FN, LIVE_EARN_ADDRESS, ZERO_ADDRESS } from '../../constants'
import { useAbleEarnAddress, useClaim, useDealEarn, useEarn, useEarnInfo, useWithdraw } from '../../hooks/useNode'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from '../../hooks/useModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import Modal from '../../components/Modal'
import { SmallButton } from '../../components/Button'
import { shortenAddress, shortenText } from '../../utils'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import JSBI from 'jsbi'
import { useParams } from 'react-router-dom'
import { useI18n } from 'react-simple-i18n'
import DetailModal from '../../components/Modal/DetailModals'
import { useBlockNumber } from '../../state/application/hooks'

const Title = styled(Typography)`
  font-size: 24px;
  color: #643877;
  text-align: center;
  font-weight: 600;
  margin: 20px;
`

function EarnModal({
  isLive,
  inviter,
  customOnDismiss
}: {
  isLive: boolean
  inviter: string | undefined
  customOnDismiss: () => void
}) {
  const { t } = useI18n()
  const { showModal, hideModal } = useModal()
  const { account, chainId } = useActiveWeb3React()
  const [typed, setTyped] = useState('')
  const fnBalance = useTokenBalance(account ?? undefined, FN[chainId ?? 56])
  const inputAmount = tryParseAmount(typed, FN[chainId ?? 56]) as TokenAmount | undefined
  const minAmount = tryParseAmount('10000', FN[chainId ?? 56]) as TokenAmount | undefined

  const enoughAsset = fnBalance && inputAmount && (fnBalance.greaterThan(inputAmount) || fnBalance.equalTo(inputAmount))
  const minAsset = inputAmount && minAmount && minAmount.greaterThan(inputAmount)
  const [approvalState, approveCallback] = useApproveCallback(
    inputAmount,
    isLive ? LIVE_EARN_ADDRESS[chainId ?? 56] : EARN_ADDRESS[chainId ?? 56]
  )
  const { earn } = useEarn({ isLive })
  const earnCallback = useCallback(async () => {
    if (!account || !inputAmount) return
    showModal(<TransactionPendingModal />)
    earn(inputAmount, inviter)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [account, inputAmount, showModal, earn, inviter, hideModal])

  return (
    <Modal
      title={isLive ? t('earn.demandDepositL') : t('earn.fixedDeposit')}
      background={'#F8F6FF'}
      closeIcon
      customOnDismiss={customOnDismiss}
    >
      <Stack mt={30} display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        <NumericalInput
          unit="FN"
          balance={fnBalance?.toFixed(2)}
          placeholder={isLive ? '' : t('minAmount')}
          endAdornment={<img alt="" style={{ width: 28, maxWidth: 'unset', marginRight: 12 }} src={fnImg} />}
          value={typed}
          height={60}
          onChange={e => {
            setTyped(e.target.value)
          }}
          onMax={() => {
            if (fnBalance) {
              setTyped(fnBalance?.toExact() ?? '')
            }
          }}
        />
        <ActionButton
          pending={approvalState === ApprovalState.PENDING}
          disableAction={!fnBalance || !inputAmount || !enoughAsset || (!isLive && minAsset)}
          actionText={
            approvalState === ApprovalState.NOT_APPROVED
              ? t('approve')
              : !inputAmount
              ? t('enter')
              : enoughAsset
              ? t('save')
              : t('insufficient')
          }
          onAction={approvalState === ApprovalState.NOT_APPROVED ? approveCallback : earnCallback}
        />
      </Stack>
    </Modal>
  )
}

export default function Earn() {
  const params = useParams<{ inviter: string }>()
  const [isCopied, setCopied] = useCopyClipboard()
  const { account, chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const { withdraw } = useWithdraw()
  const { claim } = useClaim()
  const earnInfo = useEarnInfo({ isLive: false })
  const liveEarnInfo = useEarnInfo({ isLive: true })
  const { rewards, subordinatesL1, subordinatesL2, inviter } = useDealEarn()
  const { ableAddress } = useAbleEarnAddress(params.inviter)
  const { t, i18n } = useI18n()
  const lang = i18n.getLang()
  const isEn = lang === 'en'
  const withCallback = useCallback(
    async (isLive: boolean) => {
      if (!account) return
      showModal(<TransactionPendingModal />)
      withdraw(isLive)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [account, showModal, withdraw, hideModal]
  )

  const claimCallback = useCallback(
    async (isLive: boolean) => {
      if (!account) return
      showModal(<TransactionPendingModal />)
      claim(isLive)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [account, showModal, claim, hideModal]
  )

  const blockNumber = useBlockNumber()
  console.log('blockNumber', blockNumber)

  return (
    <Stack maxWidth={isMobile ? '100%' : 540}>
      <Image style={{ margin: isMobile ? 0 : 20 }} src={isEn ? earnBannerEN : earnBanner} />
      <Stack
        margin={20}
        borderRadius={'20px'}
        sx={{ background: '#F8F6FF', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        border={'1px solid #DDDDDD'}
      >
        <Title>{t('earn.demand')}</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack>
              <Typography fontSize={18} color={'#583A8A'}>
                {t('earn.s')} FN
              </Typography>
              <Typography>{t('earn.claim')}：FN</Typography>
            </Stack>
            <Image width={40} src={fnImg} />
          </Stack>
          <Stack spacing={12}>
            <Typography fontSize={24} color={'#EBB15E'} textAlign={'center'}>
              {liveEarnInfo?.apy ? CurrencyAmount.ether(liveEarnInfo.apy.toString()).toFixed(2).toString() : '--'} %
            </Typography>
            <Typography textAlign={'center'}>{t('earn.tvl')}</Typography>
          </Stack>

          <Stack>
            <Typography fontWeight={500}>{t('balance')}</Typography>
            <Typography>
              {liveEarnInfo?.balance ? liveEarnInfo.balance.toFixed(2, { groupSeparator: ',' }) : '--'}
            </Typography>
          </Stack>
          <Stack mt={20} direction={'row'} justifyContent={'space-between'}>
            <Stack>
              <Typography fontWeight={500}>{t('rewards')}</Typography>
              <Typography>
                {liveEarnInfo?.rewards ? liveEarnInfo.rewards.toFixed(2, { groupSeparator: ',' }) : '--'}
              </Typography>
            </Stack>
            <SmallButton
              disabled={!liveEarnInfo?.rewards || liveEarnInfo.rewards.equalTo('0')}
              onClick={() => {
                claimCallback(true)
              }}
            >
              {t('claim')}
            </SmallButton>
          </Stack>
          <Stack mt={20} spacing={12} direction={'row'}>
            <Button
              onClick={() => {
                showModal(<EarnModal customOnDismiss={hideModal} isLive={true} inviter={params.inviter} />)
              }}
            >
              {t('earn.saveToken')}
            </Button>
            <Button
              disabled={!liveEarnInfo?.balance || liveEarnInfo?.balance.equalTo('0')}
              onClick={() => {
                withCallback(true)
              }}
            >
              {t('withdraw')}
            </Button>
          </Stack>
          {!!liveEarnInfo?.totalSupply && (
            <Typography
              mt={20}
              style={{ cursor: 'pointer' }}
              textAlign={'center'}
              onClick={() => {
                showModal(
                  <DetailModal
                    address={LIVE_EARN_ADDRESS[chainId ?? 56]}
                    totalRewards={'500万 FN '}
                    dayRewards={'13698.63 FN'}
                    rewards={blockNumber ? (0.47564688 * (blockNumber - 10000000)).toFixed(2).toString() : '--'}
                    totalSupply={liveEarnInfo?.totalSupply?.toFixed(2).toString()}
                  />
                )
              }}
            >{`详情 >`}</Typography>
          )}
        </Stack>
      </Stack>

      <Stack margin={20} borderRadius={'20px'} sx={{ background: '#F8F6FF' }} border={'1px solid #DDDDDD'}>
        <Title>{t('earn.fixed')}</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack>
              <Typography fontSize={18} color={'#583A8A'}>
                {t('earn.s')}FN
              </Typography>
              <Typography>{t('earn.claim')}：FN</Typography>
            </Stack>
            <Image width={40} src={fnImg} />
          </Stack>
          <Stack spacing={12}>
            <Typography fontSize={24} color={'#EBB15E'} textAlign={'center'}>
              {earnInfo?.apy ? CurrencyAmount.ether(earnInfo.apy.toString()).toFixed(2).toString() : '--'} %
            </Typography>
            <Typography textAlign={'center'}>{t('earn.tvl')}</Typography>
          </Stack>

          <Stack>
            <Typography fontWeight={500}>{t('balance')}</Typography>
            <Typography>
              {earnInfo?.balance ? earnInfo.balance.toFixed(2, { groupSeparator: ',' }).toString() : '--'}
            </Typography>
          </Stack>
          <Stack mt={20} mb={20} direction={'row'} justifyContent={'space-between'}>
            <Stack>
              <Typography fontWeight={500}>{t('rewards')}</Typography>
              <Typography>
                {earnInfo?.rewards ? earnInfo.rewards.toFixed(2, { groupSeparator: ',' }).toString() : '--'}
              </Typography>
            </Stack>
            <SmallButton
              disabled={!earnInfo?.rewards || earnInfo.rewards.equalTo('0')}
              onClick={() => {
                claimCallback(false)
              }}
            >
              {t('claim')}
            </SmallButton>
          </Stack>
          {params?.inviter && inviter === ZERO_ADDRESS && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography>{t('bind')}:</Typography>
              <Typography mb={8}>{shortenAddress(params.inviter, 12)}</Typography>
            </Stack>
          )}
          {inviter === ZERO_ADDRESS && !ableAddress && (
            <Typography fontSize={12} mb={2} color={'#FA0E0E'}>
              {t('unableAddress')}
            </Typography>
          )}
          <Stack spacing={12} direction={'row'}>
            <Button
              disabled={inviter === ZERO_ADDRESS && !ableAddress}
              onClick={() => {
                showModal(<EarnModal customOnDismiss={hideModal} isLive={false} inviter={params.inviter} />)
              }}
            >
              {t('earn.saveToken')}
            </Button>
            <Button
              disabled={!earnInfo?.balance || earnInfo?.balance.equalTo('0')}
              onClick={() => {
                withCallback(false)
              }}
            >
              {t('withdraw')}
            </Button>
          </Stack>
          {!!earnInfo?.totalSupply && (
            <Typography
              mt={20}
              style={{ cursor: 'pointer' }}
              textAlign={'center'}
              onClick={() => {
                showModal(
                  <DetailModal
                    address={LIVE_EARN_ADDRESS[chainId ?? 56]}
                    totalRewards={'1500万'}
                    dayRewards={'41095.89'}
                    rewards={blockNumber ? (1.42694064 * (blockNumber - 10000000)).toFixed(2).toString() : '--'}
                    totalSupply={earnInfo?.totalSupply?.toFixed(2).toString()}
                  />
                )
              }}
            >
              {t('detail')}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack margin={20} borderRadius={'20px'} sx={{ background: '#F8F6FF' }} border={'1px solid #DDDDDD'}>
        <Title>{t('earn.invite')}</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack spacing={12}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>
                {shortenText('https://' + window.location.host + '/earn/' + account, isMobile ? 6 : 12)}
              </Typography>
              <SmallButton
                disabled={isCopied}
                onClick={() => {
                  setCopied('https://' + window.location.host + '/earn/' + account)
                }}
              >
                {isCopied ? t('copied') : t('copy')}
              </SmallButton>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography fontWeight={500}>{t('inviteNum')}</Typography>
              <Typography>
                {subordinatesL1 && subordinatesL2
                  ? JSBI.ADD(JSBI.BigInt(subordinatesL1), JSBI.BigInt(subordinatesL2)).toString()
                  : '--'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography fontWeight={500}>{t('earn.myRewards')}</Typography>
              <Typography>{rewards ? rewards.toFixed(2, { groupSeparator: ',' }) : '--'}</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography fontWeight={500}>{t('bind')}</Typography>
              <Typography>{shortenAddress(inviter, 8)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
