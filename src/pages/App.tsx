import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import Footer from 'components/Footer'
import Node from '../pages/node'
import Earn from '../pages/earn'
import Home from '../pages/home'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.footer})`,
  padding: '50px 0 80px',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
    paddingTop: 20
  }
}))

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app">
          <ContentWrapper>
            <Header />
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              <Web3ReactManager>
                <Routes>
                  <Route path="/earn" element={<Earn />} />
                  <Route path="/earn/:inviter" element={<Earn />} />
                  <Route path="/node/:inviter" element={<Node />} />
                  <Route path="/node" element={<Node />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/sport" element={<ComingSoon />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Web3ReactManager>
            </BodyWrapper>
            <Footer />
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>{' '}
    </Suspense>
  )
}
