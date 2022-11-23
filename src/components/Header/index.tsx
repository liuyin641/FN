import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Box, MenuItem, styled as muiStyled, styled } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
// import NetworkSelect from './NetworkSelect'
import Image from '../Image'
import logo from '../../assets/images/logo.png'
import logoText from '../../assets/images/logo-text.png'
import { isMobile } from 'react-device-detect'
import Lang from './Lang'
import { useI18n } from 'react-simple-i18n'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

export interface Tab extends TabContent {
  subTab?: TabContent[]
}

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(Link)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 40px 0 25px!important',
  zIndex: theme.zIndex.drawer,
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.text.primary,
    opacity: 0.5,
    marginRight: 48,
    paddingBottom: '30px',
    borderBottom: '2px solid transparent',
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.text.primary
    },
    '&:hover': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px 0 0!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(Link)(({ theme }) => ({
  '& img': {
    width: 180.8,
    height: 34.7
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    '& img': { width: 100, height: 'auto' },
    marginBottom: -10
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 60,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const { t } = useI18n()
  const Tabs: Tab[] = [
    { title: t('home.title'), route: routes.Home },
    { title: t('node.title'), route: routes.Node },
    { title: t('earn.title'), route: routes.Earn },
    { title: t('sport.title'), link: 'https://dapp.formulanets.info' }
  ]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Box display="flex" alignItems="center">
          <Image src={logo} width={isMobile ? 18 : 28} />
          <Image style={{ marginLeft: 12 }} src={logoText} height={isMobile ? 10 : 20} />
          <MainLogo id={'logo'} to={'/'}></MainLogo>
          <HideOnMobile breakpoint="md">
            <LinksWrapper>
              {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                subTab ? (
                  <Box
                    sx={{
                      marginRight: {
                        xs: 15,
                        lg: 48
                      },
                      height: 'auto',
                      paddingBottom: '30px',
                      borderBottom: '2px solid transparent',
                      borderColor: theme =>
                        subTab.some(tab => tab.route && pathname.includes(tab.route))
                          ? theme.palette.text.primary
                          : 'transparnet',
                      display: 'inline'
                    }}
                    key={title + idx}
                  >
                    <PlainSelect
                      key={title + idx}
                      placeholder={title}
                      autoFocus={false}
                      width={title === 'Test' ? '70px' : undefined}
                      style={{
                        height: '16px'
                      }}
                    >
                      {subTab.map((sub, idx) =>
                        sub.link ? (
                          <MenuItem
                            key={sub.link + idx}
                            sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                            selected={false}
                          >
                            <ExternalLink
                              href={sub.link}
                              className={'link'}
                              color="#00000050"
                              sx={{
                                '&:hover': {
                                  color: '#232323!important'
                                }
                              }}
                            >
                              {sub.titleContent ?? sub.title}
                            </ExternalLink>
                          </MenuItem>
                        ) : (
                          <MenuItem key={sub.title + idx}>
                            <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                          </MenuItem>
                        )
                      )}
                    </PlainSelect>
                  </Box>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : (
                  <Link
                    style={{ fontWeight: 500 }}
                    key={title + idx}
                    id={`${route}-nav-link`}
                    to={route ?? ''}
                    className={
                      (route
                        ? pathname.includes(route)
                          ? 'active'
                          : pathname.includes('account')
                          ? route.includes('account')
                            ? 'active'
                            : ''
                          : ''
                        : '') + ' link'
                    }
                  >
                    {titleContent ?? title}
                  </Link>
                )
              )}
            </LinksWrapper>
          </HideOnMobile>
        </Box>

        <Box display="flex" alignItems="center" gap={{ xs: '6px', sm: '20px' }}>
          {/*<NetworkSelect />*/}
          <Web3Status />
          <Lang />
          <ShowOnMobile breakpoint="md">
            {/*<IconButton*/}
            {/*  sx={{*/}
            {/*    border: '1px solid rgba(0, 0, 0, 0.1)',*/}
            {/*    height: { xs: 24, sm: 32 },*/}
            {/*    width: { xs: 24, sm: 32 },*/}
            {/*    mb: { xs: 0, sm: 15 },*/}
            {/*    mt: { xs: 0, sm: 8 },*/}
            {/*    padding: '4px',*/}
            {/*    borderRadius: '8px'*/}
            {/*  }}*/}
            {/*  onClick={() => {*/}
            {/*    setMobileMenuOpen(open => !open)*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="#252525">*/}
            {/*    <path d="M1 1H13" strokeWidth="1.4" strokeLinecap="round" />*/}
            {/*    <path d="M1 7H13" strokeWidth="1.4" strokeLinecap="round" />*/}
            {/*  </svg>*/}
            {/*</IconButton>*/}
          </ShowOnMobile>
        </Box>
      </StyledAppBar>
    </>
  )
}
