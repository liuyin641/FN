import { Button, Grid, Stack, styled, Typography } from '@mui/material'
import Image from '../../components/Image'
import nodeBanner from '../../assets/images/node-banner.png'
import nodeBannerEN from '../../assets/images/node-banner-en.png'
import Divider from '../../components/Divider'
import { isMobile } from 'react-device-detect'
import ActionButton from '../../components/Button/ActionButton'
import usdtImg from '../../assets/images/usdt.png'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import NumericalInput from 'components/Input/InputNumerical'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useCallback } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { TokenAmount } from '../../constants/token'
import { tryParseAmount } from '../../utils/parseAmount'
import { NODE_SALE_ADDRESS, USDT, ZERO_ADDRESS } from '../../constants'
import { useBuy, useClaimNodeRewards, useIsNode, useNodeInfo, useNodeRewards } from '../../hooks/useNode'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from '../../hooks/useModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { SmallButton } from '../../components/Button'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { useParams } from 'react-router-dom'
import { shortenAddress, shortenText } from '../../utils'
import { useI18n } from 'react-simple-i18n'

const Title = styled(Typography)`
  font-size: 24px;
  color: #643877;
  text-align: center;
  margin: 20px;
`

function InfoItem({ title, value }: { title: string; value: string }) {
  return (
    <Grid key={title} item xs={4}>
      <Stack width={100} spacing={8}>
        <Typography>{title}</Typography>
        <Typography fontSize={12}>{value}</Typography>
      </Stack>
    </Grid>
  )
}

export default function Node() {
  const params = useParams<{ inviter: string }>()
  const typed = '1000'
  const [isCopied, setCopied] = useCopyClipboard()
  const { showModal, hideModal } = useModal()
  const { account, chainId } = useActiveWeb3React()
  const { buy } = useBuy()
  const { claim } = useClaimNodeRewards()
  const { t, i18n } = useI18n()
  const usdtBalance = useTokenBalance(account ?? undefined, USDT[chainId ?? 56])
  const inputAmount = tryParseAmount(typed, USDT[chainId ?? 56]) as TokenAmount | undefined
  const [approvalState, approveCallback] = useApproveCallback(inputAmount, NODE_SALE_ADDRESS[chainId ?? 56])
  const { isNode, nodeCount, subordinates, reward, inviter } = useNodeInfo()
  const { totalRewards, rewardPer, rewards, claimedRewards } = useNodeRewards()
  const enoughAsset = usdtBalance && inputAmount && usdtBalance.greaterThan(inputAmount)

  const { ableNode } = useIsNode(params.inviter)

  const lang = i18n.getLang()
  const isEn = lang === 'en'

  const buyCallback = useCallback(async () => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    buy(params?.inviter)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        console.log('err', err)
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [account, showModal, buy, params?.inviter, hideModal])

  const claimCallback = useCallback(async () => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    claim()
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
  }, [account, showModal, claim, hideModal])
  return (
    <Stack maxWidth={isMobile ? '100%' : 540}>
      <Image style={{ margin: isMobile ? 0 : 20 }} src={isEn ? nodeBannerEN : nodeBanner} />
      <Stack
        margin={20}
        sx={{ background: '#F8F6FF', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        border={'1px solid #DDDDDD'}
        borderRadius={'20px'}
      >
        <Title>{t('node.buy')}</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <NumericalInput
            style={{ marginBottom: 20 }}
            unit="USDT"
            balance={usdtBalance?.toFixed(2)}
            placeholder={''}
            endAdornment={<img alt="" style={{ width: 28, maxWidth: 'unset', marginRight: 12 }} src={usdtImg} />}
            value={typed}
            height={60}
          />
          {params?.inviter && inviter === ZERO_ADDRESS && (
            <Stack mb={8} direction={'row'} justifyContent={'space-between'}>
              <Typography>{t('bind')}:</Typography>
              <Typography>{shortenAddress(params.inviter, 12)}</Typography>
            </Stack>
          )}
          {(!inviter || inviter === ZERO_ADDRESS) && !ableNode ? (
            <Typography fontSize={12} mb={8} color={'#FA0E0E'}>
              {t('unableAddress')}
            </Typography>
          ) : null}
          <ActionButton
            pendingText={t('approving')}
            pending={approvalState === ApprovalState.PENDING}
            disableAction={!usdtBalance || isNode || !enoughAsset}
            actionText={
              isNode
                ? t('node.bought')
                : !enoughAsset
                ? t('insufficient')
                : approvalState === ApprovalState.NOT_APPROVED
                ? t('approve')
                : t('pay')
            }
            onAction={approvalState === ApprovalState.NOT_APPROVED ? approveCallback : buyCallback}
          />
        </Stack>
      </Stack>

      <Stack margin={20} borderRadius={'20px'} mt={30} sx={{ background: '#F8F6FF' }} border={'1px solid #DDDDDD'}>
        <Title>{t('inviteLink')}</Title>
        <Divider />
        <Stack padding={isMobile ? 20 : 30}>
          <Stack spacing={12}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>
                {shortenText('https://' + window.location.host + '/node/' + account, isMobile ? 6 : 12)}
              </Typography>
              <SmallButton
                disabled={isCopied}
                onClick={() => {
                  setCopied('https://' + window.location.host + '/node/' + account)
                }}
              >
                {isCopied ? t('copied') : 'copy'}
              </SmallButton>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>{t('inviteNum')}</Typography>
              <Typography>{subordinates ? subordinates : '--'}</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>{t('node.rewards')}</Typography>
              <Typography>{reward ? reward.toSignificant(4, { significantDigits: ',' }) : '--'} U</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography>{t('bind')}</Typography>
              <Typography>{shortenAddress(inviter, 10)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        margin={20}
        borderRadius={'20px'}
        mt={30}
        sx={{ background: '#F8F6FF' }}
        border={'1px solid #DDDDDD'}
        padding={isMobile ? 20 : 30}
      >
        <Grid container rowSpacing={12}>
          <InfoItem title={t('node.nodes')} value={nodeCount ? nodeCount.toString() : '--'} />
          <InfoItem title={t('node.isNode')} value={isNode ? t('yes') : t('no')} />
          <InfoItem
            title={t('node.totalRewards')}
            value={`${totalRewards ? totalRewards?.toFixed(2).toString() : '--'} USDT`}
          />
          <InfoItem
            title={t('node.preRewards')}
            value={`${rewardPer ? rewardPer?.toFixed(2, { groupSeparator: ',' }).toString() : '--'} USDT`}
          />
          <InfoItem
            title={t('node.claimedRewards')}
            value={`${claimedRewards ? claimedRewards?.toFixed(2, { groupSeparator: ',' }).toString() : '--'} USDT`}
          />
          <InfoItem
            title={t('node.ableRewards')}
            value={`${rewards ? rewards?.toFixed(2, { groupSeparator: ',' }).toString() : '--'} USDT`}
          />
        </Grid>
        <Button disabled={!rewards || rewards.equalTo('0')} onClick={claimCallback} sx={{ marginTop: 30 }}>
          {t('node.claim')}
        </Button>
      </Stack>
    </Stack>
  )
}
