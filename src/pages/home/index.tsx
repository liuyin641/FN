import { isMobile } from 'react-device-detect'
import Image from '../../components/Image'
import homeBanner from '../../assets/images/home-banner.png'
import homeBannerEn from '../../assets/images/home-banner-en.png'
import title1 from '../../assets/images/home-title-1.png'
import title1en from '../../assets/images/home-title-1-en.png'
import title2 from '../../assets/images/home-title-2.png'
import title2en from '../../assets/images/home-title-2-en.png'
import title3 from '../../assets/images/home-title-3.png'
import title3en from '../../assets/images/home-title-3-en.png'
import title4 from '../../assets/images/home-title-4.png'
import title4en from '../../assets/images/home-title-4-en.png'
import check from '../../assets/images/check.png'
import percent from '../../assets/images/percent.png'
import percentEN from '../../assets/images/percent-en.png'
import rule from '../../assets/images/rule.png'
import earn from '../../assets/images/earn.png'
import lock from '../../assets/images/lock.png'
import lockEN from '../../assets/images/lock-en.png'

import { Stack, styled, Typography } from '@mui/material'
import { useI18n } from 'react-simple-i18n'

const TextBG = styled('div')`
  height: 8px;
  width: 100%;
  background: linear-gradient(84deg, #7d2750 0%, #3b5b8f 100%);
  position: absolute;
  margin-top: 22px;
  border-radius: 3px;
  opacity: 0.6;
`

export default function Home() {
  const { t, i18n } = useI18n()
  const lang = i18n.getLang()
  const isEn = lang === 'en'
  return (
    <Stack maxWidth={isMobile ? '100%' : 540} paddingBottom={200}>
      <Image style={{ margin: 20 }} src={isEn ? homeBannerEn : homeBanner} />
      <Stack alignItems={'center'} spacing={30} padding={'20px'}>
        <Image width={160} src={isEn ? title1en : title1} />
        <Stack alignSelf={'start'} position={'relative'}>
          <Typography fontWeight={500} marginLeft={8} marginRight={8} fontSize={20}>
            {t('home.token')}
          </Typography>
          <TextBG />
        </Stack>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack spacing={8}>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule1')}</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule2')}</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule3')}</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule4')}</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule5')}</Typography>
            </Stack>
            <Stack spacing={4} alignItems={'center'} direction={'row'}>
              <Image width={20} src={check} />
              <Typography>{t('home.rule6')}</Typography>
            </Stack>
          </Stack>
          <Image
            style={{ marginLeft: 30 }}
            width={isMobile ? 80 : 180}
            height={'fit-content'}
            src={isEn ? percentEN : percent}
          />
        </Stack>
        <Image width={160} src={isEn ? title2en : title2} />
        <Stack alignItems={'center'} direction={'row'}>
          <Image width={160} src={rule} />
          <Typography>{t('home.text1')}</Typography>
        </Stack>
        <Image width={160} src={isEn ? title3en : title3} />
        <Image width={'80%'} src={isEn ? lockEN : lock} />
        <Image width={160} src={isEn ? title4en : title4} />
        <Stack>
          <Image style={{ alignSelf: 'flex-end' }} width={200} src={earn} />
          <Typography mt={20}>{t('home.text2')}</Typography>
          <Typography>{t('home.text3')}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
