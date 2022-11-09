import { Stack, styled, Typography } from '@mui/material'
import MessageBox from './MessageBox'
import Image from '../../Image'
import fn from '../../../assets/images/fn.png'
import { shortenAddress } from '../../../utils'
import { useI18n } from 'react-simple-i18n'

const Text = styled(Typography)`
  font-weight: 400;
  color: #703c89;
`

export default function DetailModal({
  address,
  totalRewards,
  dayRewards,
  rewards,
  totalSupply
}: {
  address?: string
  totalRewards?: string
  dayRewards?: string
  rewards?: string
  totalSupply?: string
}) {
  const { t } = useI18n()
  return (
    <MessageBox width={'360px'}>
      <Stack gap={12} paddingLeft={20} paddingRight={20} width={'100%'} pb={30}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Text>{t('contract')}</Text>
          <Text>{address ? shortenAddress(address) : '--'}</Text>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Text>{t('startTime')}</Text>
          <Text>2022-11-20 21:00</Text>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Text>{t('endTime')}</Text>
          <Text>2023-11-12 21:00</Text>
        </Stack>
        <Stack spacing={6}>
          <Text textAlign={'left'}>{t('totalReward')}</Text>
          <Stack direction={'row'} spacing={6}>
            <Image width={24} src={fn} />
            <Text textAlign={'left'}>{totalRewards ? totalRewards : '--'} FN</Text>
          </Stack>
        </Stack>
        <Stack spacing={6}>
          <Text textAlign={'left'}>{t('dailyReward')}</Text>
          <Stack direction={'row'} spacing={6}>
            <Image width={24} src={fn} />
            <Text textAlign={'left'}>{dayRewards ? dayRewards : '--'} FN</Text>
          </Stack>
        </Stack>
        <Stack spacing={6}>
          <Text textAlign={'left'}>{t('realizedReward')}</Text>
          <Stack direction={'row'} spacing={6}>
            <Image width={24} src={fn} />
            <Text textAlign={'left'}>{rewards ? rewards : '--'} FN</Text>
          </Stack>
        </Stack>
        <Stack spacing={6}>
          <Text textAlign={'left'}>{t('tvl')}</Text>
          <Stack direction={'row'} spacing={6}>
            <Image width={24} src={fn} />
            <Text textAlign={'left'}>{totalSupply ? totalSupply : '--'} FN</Text>
          </Stack>
        </Stack>
      </Stack>
    </MessageBox>
  )
}
