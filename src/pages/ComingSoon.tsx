import { styled } from '@mui/material'
import { Dots } from 'theme/components'
import { useI18n } from 'react-simple-i18n'

const Frame = styled('div')(`
width: calc(100% - 40px);
max-width: 500px;
margin: 20px;
height: 280px;
border: 1px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
border-radius: 32px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #ffffff;
`)

const Title = styled('p')(`
  font-weight: 500;
  font-size: 24px;
  line-height: 88.69%;
`)

export default function ComingSoon() {
  const { t } = useI18n()
  return (
    <Frame>
      <Title>
        {t('coming')} <Dots />
      </Title>
      <div>{t('implemeting')}</div>
      <div>{t('back')}</div>
    </Frame>
  )
}
