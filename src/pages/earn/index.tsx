import { Button, Stack, styled, Typography } from '@mui/material'
import Image from '../../components/Image'
import earnBanner from '../../assets/images/earn-banner.png'
import Divider from '../../components/Divider'
import { isMobile } from 'react-device-detect'
import ActionButton from '../../components/Button/ActionButton'
import usdtImg from '../../assets/images/usdt.png'
import fnImg from '../../assets/images/fn.png'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import NumericalInput from 'components/Input/InputNumerical'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useCallback, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { TokenAmount } from '../../constants/token'
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
  const { showModal, hideModal } = useModal()
  const { account, chainId } = useActiveWeb3React()
  const [typed, setTyped] = useState('')
  const fnBalance = useTokenBalance(account ?? undefined, FN[chainId ?? 56])
  const inputAmount = tryParseAmount(typed, FN[chainId ?? 56]) as TokenAmount | undefined
  const enoughAsset = fnBalance && inputAmount && fnBalance.greaterThan(inputAmount)
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
    <Modal title={isLive ? '活期存币' : '定期存币'} background={'#F8F6FF'} closeIcon customOnDismiss={customOnDismiss}>
      <Stack mt={30} display="grid" padding="40px 24px" gap="24px" justifyItems="center">
        <NumericalInput
          unit="FN"
          balance={fnBalance?.toFixed(2)}
          placeholder={''}
          endAdornment={<img alt="" style={{ width: 28, maxWidth: 'unset', marginRight: 12 }} src={usdtImg} />}
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
          disableAction={!fnBalance || !inputAmount || !enoughAsset}
          actionText={
            approvalState === ApprovalState.NOT_APPROVED
              ? '授权'
              : !inputAmount
              ? '输入金额'
              : enoughAsset
              ? '存入'
              : '余额不足'
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
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const { withdraw } = useWithdraw()
  const { claim } = useClaim()
  const earnInfo = useEarnInfo({ isLive: false })
  const liveEarnInfo = useEarnInfo({ isLive: true })
  const { rewards, subordinatesL1, subordinatesL2, inviter } = useDealEarn()
  const { ableAddress } = useAbleEarnAddress(params.inviter)
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

  return (
    <Stack maxWidth={isMobile ? '100%' : 540}>
      <Image style={{ margin: isMobile ? 0 : 20 }} src={earnBanner} />
      <Stack
        margin={20}
        borderRadius={'20px'}
        sx={{ background: '#F8F6FF', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        border={'1px solid #DDDDDD'}
      >
        <Title>活期</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack>
              <Typography fontSize={18} color={'#583A8A'}>
                存FN
              </Typography>
              <Typography>奖励：FN</Typography>
            </Stack>
            <Image width={40} src={fnImg} />
          </Stack>
          <Stack spacing={12}>
            <Typography fontSize={24} color={'#EBB15E'} textAlign={'center'}>
              0%
            </Typography>
            <Typography textAlign={'center'}>年化收益率</Typography>
          </Stack>

          <Stack>
            <Typography>我的资金</Typography>
            <Typography>
              {liveEarnInfo?.balance ? liveEarnInfo.balance.toSignificant(4, { groupSeparator: ',' }) : '--'}
            </Typography>
          </Stack>
          <Stack mt={20} direction={'row'} justifyContent={'space-between'}>
            <Stack>
              <Typography>奖励</Typography>
              <Typography>
                {liveEarnInfo?.rewards ? liveEarnInfo.rewards.toSignificant(4, { groupSeparator: ',' }) : '--'}
              </Typography>
            </Stack>
            <SmallButton
              disabled={!liveEarnInfo?.rewards || liveEarnInfo.rewards.equalTo('0')}
              onClick={() => {
                claimCallback(true)
              }}
            >
              领取
            </SmallButton>
          </Stack>
          <Stack mt={20} spacing={12} direction={'row'}>
            <Button
              onClick={() => {
                showModal(<EarnModal customOnDismiss={hideModal} isLive={true} inviter={params.inviter} />)
              }}
            >
              存币
            </Button>
            <Button
              disabled={!liveEarnInfo?.balance || liveEarnInfo?.balance.equalTo('0')}
              sx={{ background: '#A1A1A1' }}
              onClick={() => {
                withCallback(true)
              }}
            >
              撤出
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack margin={20} borderRadius={'20px'} sx={{ background: '#F8F6FF' }} border={'1px solid #DDDDDD'}>
        <Title>定期</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack>
              <Typography fontSize={18} color={'#583A8A'}>
                存FN
              </Typography>
              <Typography>奖励：FN</Typography>
            </Stack>
            <Image width={40} src={fnImg} />
          </Stack>
          <Stack spacing={12}>
            <Typography fontSize={24} color={'#EBB15E'} textAlign={'center'}>
              0%
            </Typography>
            <Typography textAlign={'center'}>年化收益率</Typography>
          </Stack>

          <Stack>
            <Typography>我的资金</Typography>
            <Typography>
              {earnInfo?.balance ? earnInfo.balance.toSignificant(4, { groupSeparator: ',' }).toString() : '--'}
            </Typography>
          </Stack>
          <Stack mt={20} direction={'row'} justifyContent={'space-between'}>
            <Stack>
              <Typography>奖励</Typography>
              <Typography>
                {earnInfo?.rewards ? earnInfo.rewards.toSignificant(4, { groupSeparator: ',' }).toString() : '--'}
              </Typography>
            </Stack>
            <SmallButton
              disabled={!earnInfo?.rewards || earnInfo.rewards.equalTo('0')}
              onClick={() => {
                claimCallback(false)
              }}
            >
              领取
            </SmallButton>
          </Stack>
          {params?.inviter && inviter === ZERO_ADDRESS && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography>上级地址:</Typography>
              <Typography mb={8}>{shortenAddress(params.inviter, 12)}</Typography>
            </Stack>
          )}
          {inviter === ZERO_ADDRESS && !ableAddress && (
            <Typography fontSize={12} mb={2} color={'#FA0E0E'}>
              链接未激活，请更换链接
            </Typography>
          )}
          <Stack mt={20} spacing={12} direction={'row'}>
            <Button
              disabled={inviter === ZERO_ADDRESS && !ableAddress}
              onClick={() => {
                showModal(<EarnModal customOnDismiss={hideModal} isLive={false} inviter={params.inviter} />)
              }}
            >
              存币
            </Button>
            <Button
              disabled={!earnInfo?.balance || earnInfo?.balance.equalTo('0')}
              sx={{ background: '#A1A1A1' }}
              onClick={() => {
                withCallback(false)
              }}
            >
              撤出
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack margin={20} borderRadius={'20px'} sx={{ background: '#F8F6FF' }} border={'1px solid #DDDDDD'}>
        <Title>节点推荐</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack spacing={12}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>{shortenText(window.location.host + '/earn/' + account, isMobile ? 6 : 12)}</Typography>
              <SmallButton
                disabled={isCopied}
                onClick={() => {
                  setCopied(window.location.host + '/earn/' + account)
                }}
              >
                {isCopied ? '已复制' : '复制连接'}
              </SmallButton>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>推荐人数</Typography>
              <Typography>
                {subordinatesL1 && subordinatesL2
                  ? JSBI.ADD(JSBI.BigInt(subordinatesL1), JSBI.BigInt(subordinatesL2)).toString()
                  : '--'}
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>已获得奖励</Typography>
              <Typography>{rewards ? rewards.toSignificant(4, { groupSeparator: ',' }) : '--'}</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>我的上级</Typography>
              <Typography>{shortenAddress(inviter, 8)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
