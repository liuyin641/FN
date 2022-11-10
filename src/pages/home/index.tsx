import { isMobile } from 'react-device-detect'
import Image from '../../components/Image'
import homeBanner from '../../assets/images/home-banner.png'
import homeBannerEn from '../../assets/images/home-banner-en.png'
import { Stack } from '@mui/material'
import { useI18n } from 'react-simple-i18n'
import home from '../../assets/images/home.png'
import homeEN from '../../assets/images/home-en.png'
import { ExternalLink } from '../../theme/components'
import telegram from '../../assets/socialLinksIcon/telegram.svg'
import twitter from '../../assets/socialLinksIcon/twitter.svg'

export default function Home() {
  const { i18n } = useI18n()
  const lang = i18n.getLang()
  const isEn = lang === 'en'
  return (
    <Stack fontSize={'0'} maxWidth={isMobile ? '100%' : 540} paddingBottom={30}>
      <Image width={isMobile ? '100%' : 540} src={isEn ? homeBannerEn : homeBanner} />
      <Image height={'fit-content'} src={isEn ? homeEN : home} />
      {/*<Stack alignItems={'center'} spacing={30} padding={'20px'}>*/}
      {/*  <Image width={160} src={isEn ? title1en : title1} />*/}
      {/*  <Stack alignSelf={'start'} position={'relative'}>*/}
      {/*    <Typography fontWeight={500} marginLeft={8} marginRight={8} fontSize={20}>*/}
      {/*      {t('home.token')}*/}
      {/*    </Typography>*/}
      {/*    <TextBG />*/}
      {/*  </Stack>*/}
      {/*  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>*/}
      {/*    <Stack spacing={8}>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule1')}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule2')}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule3')}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule4')}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule5')}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Stack spacing={4} alignItems={'center'} direction={'row'}>*/}
      {/*        <Image width={20} src={check} />*/}
      {/*        <Typography fontWeight={500}>{t('home.rule6')}</Typography>*/}
      {/*      </Stack>*/}
      {/*    </Stack>*/}
      {/*    <Image*/}
      {/*      style={{ marginLeft: 30 }}*/}
      {/*      width={isMobile ? 80 : 180}*/}
      {/*      height={'fit-content'}*/}
      {/*      src={isEn ? percentEN : percent}*/}
      {/*    />*/}
      {/*  </Stack>*/}
      {/*  <Image width={160} src={isEn ? title2en : title2} />*/}
      {/*  <Stack alignItems={'center'} direction={'row'}>*/}
      {/*    <Image width={160} src={rule} />*/}
      {/*    <Typography fontWeight={500}>{t('home.text1')}</Typography>*/}
      {/*  </Stack>*/}
      {/*  <Image width={160} src={isEn ? title3en : title3} />*/}
      {/*  <Image width={'80%'} src={isEn ? lockEN : lock} />*/}
      {/*  <Image width={160} src={isEn ? title4en : title4} />*/}
      {/*  <Stack>*/}
      {/*    <Image style={{ alignSelf: 'flex-end' }} width={200} src={earn} />*/}
      {/*    <Typography fontWeight={500} mt={20}>*/}
      {/*      {t('home.text2')}*/}
      {/*    </Typography>*/}
      {/*    <Typography fontWeight={500}>{t('home.text3')}</Typography>*/}
      {/*  </Stack>*/}
      {/*</Stack>*/}
      <Stack pt={30} spacing={23} margin={'auto'} direction={'row'}>
        <ExternalLink href={''}>
          <Image width={28} src={telegram} />
        </ExternalLink>
        <ExternalLink href={''}>
          <Image width={28} src={twitter} />
        </ExternalLink>
      </Stack>
    </Stack>
  )
}
