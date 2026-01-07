import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Drawer,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ChatButtonProps {
  itemName: string;
  itemType: 'venue' | 'event';
  itemId: number;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  itemName,
  itemType,
  itemId,
  unreadCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        color="primary"
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          bgcolor: '#2196f3',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              {itemName.charAt(0)}
            </Avatar>
            <Typography variant="h6">{itemName}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            {/* Chat messages will be rendered here */}
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatButton; 