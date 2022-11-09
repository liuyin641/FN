import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Modal from 'components/Modal'
import useModal from 'hooks/useModal'
import { Close } from '@mui/icons-material'
import Divider from '../../Divider'

interface Props {
  children?: React.ReactNode
  width?: string
}

export default function MessageBox({ children, width = '480px' }: Props) {
  const { hideModal } = useModal()

  return (
    <Modal maxWidth={'380px'} width={width} background={'#F8F6FF'}>
      <Box display={'grid'} alignItems={'center'} justifyItems="center" gap="20px">
        <Stack padding={'20px'} pb={0} width={'100%'} direction={'row'} justifyContent={'space-between'}>
          <Stack>
            <Typography fontSize={18} fontWeight={500}>
              FN
            </Typography>
            <Typography fontSize={12}>FORMULA NETWORK</Typography>
          </Stack>
          <Close onClick={hideModal} sx={{ cursor: 'pointer' }} />
        </Stack>
        <Divider />
        <Box fontSize="18px" textAlign="center" display="grid" justifyItems="center" width="100%">
          {children}
        </Box>

        {/*<Box display="flex" justifyContent="space-around" width="100%" marginTop="10px">*/}
        {/*  <Button onClick={hideModal}>Close</Button>*/}
        {/*</Box>*/}
      </Box>
    </Modal>
  )
}
