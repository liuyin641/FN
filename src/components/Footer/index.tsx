import { Stack, Typography } from '@mui/material'
import { ShowOnMobile } from 'theme/index'
import Image from '../Image'
import { Link } from 'react-router-dom'
import home from '../../assets/images/home_icon.png'
import node from '../../assets/images/node_icon.png'
import earn from '../../assets/images/earn_icon.png'
import sport from '../../assets/images/sport_icon.png'

interface TabContent {
  title: string
  icon: string
  router: string
}

const Tabs: TabContent[] = [
  { title: '首页', icon: home, router: './home' },
  { title: '节点', icon: node, router: './node' },
  { title: '赚币', icon: earn, router: './earn' },
  { title: '体育', icon: sport, router: './sport' }
]

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
  return (
    <ShowOnMobile>
      <Stack position={'absolute'} bottom={0} width={'100vw'} direction={'row'} justifyContent={'space-around'}>
        {Tabs.map(({ title, icon, router }) => {
          return <TabButton key={title} icon={icon} title={title} router={router} />
        })}
      </Stack>
    </ShowOnMobile>
  )
}
