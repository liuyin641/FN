import { Drawer } from '@mui/material'

export default function MobileMenu({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Drawer
      open={isOpen}
      onClose={onDismiss}
      anchor="top"
      BackdropProps={{ sx: { backgroundColor: 'transparent' } }}
      PaperProps={{
        sx: {
          top: theme => ({ xs: theme.height.mobileHeader, sm: theme.height.header })
        }
      }}
      sx={{
        zIndex: theme => theme.zIndex.appBar,
        overflow: 'hidden',
        top: theme => ({ xs: theme.height.mobileHeader, sm: theme.height.header })
      }}
    ></Drawer>
  )
}
