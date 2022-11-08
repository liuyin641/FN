import { isMobile } from 'react-device-detect'
import Image from '../../components/Image'
import homeBanner from '../../assets/images/home-banner.png'
import title1 from '../../assets/images/home-title-1.png'
import title2 from '../../assets/images/home-title-2.png'
import title3 from '../../assets/images/home-title-3.png'
import title4 from '../../assets/images/home-title-4.png'
import check from '../../assets/images/check.png'
import percent from '../../assets/images/percent.png'
import rule from '../../assets/images/rule.png'
import earn from '../../assets/images/earn.png'

import { Stack, styled, Typography } from '@mui/material'

const TextBG = styled('div')`
  height: 8px;
  width: 80px;
  background: linear-gradient(84deg, #7d2750 0%, #3b5b8f 100%);
  position: absolute;
  margin-top: 12px;
  border-radius: 3px;
  opacity: 0.6;
`

export default function Home() {
  return (
    <Stack maxWidth={isMobile ? '100%' : 540} paddingBottom={200}>
      <Image style={{ margin: 20 }} src={homeBanner} />

      <Stack alignItems={'center'} spacing={30} padding={'20px'}>
        <Image width={160} src={title1} />
        <Stack alignSelf={'start'}>
          <Typography marginLeft={8} fontWeight={500} fontSize={20}>
            代币FN
          </Typography>
          <TextBG />
        </Stack>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack spacing={8}>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>总量：1亿</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>4000万底池+2000万节点锁仓</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>2000万节点权益，锁仓一年</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>1500万定期利息</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>2000万定期推荐奖励</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>500万活期利息</Typography>
            </Stack>
          </Stack>
          <Image style={{ marginLeft: 30 }} width={isMobile ? 80 : 140} height={'fit-content'} src={percent} />
        </Stack>
        <Image width={160} src={title2} />
        <Stack alignItems={'center'} direction={'row'}>
          <Image width={160} src={rule} />
          <Typography>买卖滑点6%，2%回流， 2%技术营销，2%节点分 红，转账无滑手续费</Typography>
        </Stack>
        <Image width={160} src={title3} />
        <Stack>
          <Stack></Stack>
          <Stack></Stack>
          <Stack></Stack>
        </Stack>
        <Image width={160} src={title4} />
        <Stack>
          <Image style={{ alignSelf: 'flex-end' }} width={200} src={earn} />
          <Typography mt={20}>1.活期存币，收益和本金可随存随取</Typography>
          <Typography>2.定期存币，收益可限时领取，本金30天期满后可提取， 也可以承担违约金提前强制解除</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
