import { Stack, Typography } from '@mui/material'
import { ShowOnMobile } from 'theme/index'
import Image from '../Image'
import { Link } from 'react-router-dom'
import home from '../../assets/images/home_icon.png'
import node from '../../assets/images/node_icon.png'
import earn from '../../assets/images/earn_icon.png'
import sport from '../../assets/images/sport_icon.png'
import { useI18n } from 'react-simple-i18n'

interface TabContent {
  title: string
  icon: string
  router: string
}

function TabButton({ icon, title, router }: { icon: string; title: string; router: string }) {
  return (
    <Link to={router}>
      <Stack spacing={6} alignItems={'center'}>
        <Image width={'26vw'} src={icon} />
        <Typography>{title}</Typography>
      </Stack>
    </Link>
  )
}

export default function Footer() {
  const { t } = useI18n()

  const Tabs: TabContent[] = [
    { title: t('home.title'), icon: home, router: './home' },
    { title: t('node.title'), icon: node, router: './node' },
    { title: t('earn.title'), icon: earn, router: './earn' },
    { title: t('sport.title'), icon: sport, router: './sport' }
  ]
  return (
    <ShowOnMobile>
      <Stack
        sx={{ background: '#F8F6FF' }}
        position={'fixed'}
        bottom={0}
        width={'100vw'}
        direction={'row'}
        justifyContent={'space-around'}
        padding={'10px 0px'}
      >
        {Tabs.map(({ title, icon, router }) => {
          return <TabButton key={title} icon={icon} title={title} router={router} />
        })}
      </Stack>
    </ShowOnMobile>
  )
}
