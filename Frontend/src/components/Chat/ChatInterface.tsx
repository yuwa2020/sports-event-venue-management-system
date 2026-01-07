import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Drawer,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { Send, Close, ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isGroupMessage: boolean;
  senderAvatar?: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: number;
    name: string;
  };
  otherUser: {
    id: number;
    name: string;
    image?: string;
  };
  eventOrVenueName?: string;
  position?: 'left' | 'right' | 'bottom';
  width?: number | string;
  showChatTabs?: boolean;
  onBackClick?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  currentUser,
  otherUser,
  eventOrVenueName,
  position = 'right',
  width = 350,
  showChatTabs = true,
  onBackClick,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const conversationId = 2; // Temporary Conversation ID for testing
  
  // Fetch messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("currentUser.id", currentUser.id);
      console.log("otherUser.id", otherUser.id);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/conversations/${conversationId}/messages`
        );
        const fetchedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_id === currentUser.id ? currentUser.name : otherUser.name,
          content: msg.content,
          timestamp: msg.created_at,
          isGroupMessage: false, // One-to-one chat
          senderAvatar:
            msg.sender_id === currentUser.id
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`
              : otherUser.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=random`,
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, currentUser.id, otherUser.name, otherUser.image]);

  // Send a message to Supabase
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          senderId: currentUser.id,
          content: message,
        };
  
        const response = await axios.post(
          `http://localhost:3000/api/conversations/${conversationId}/messages`,
          newMessage
        );
  
        const sentMessage: Message = {
          id: response.data.data.id,
          sender: currentUser.name,
          content: message,
          timestamp: new Date().toISOString(),
          isGroupMessage: false,
          senderAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`,
        };
  
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <Drawer
      anchor={position}
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          height: position === 'bottom' ? '70vh' : '100vh',
          borderRadius: position === 'right' ? '12px 0 0 12px' : undefined,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 2, background: '#2196f3', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {onBackClick && (
                <IconButton onClick={onBackClick} size="small" sx={{ color: 'white' }}>
                  <ArrowBack />
                </IconButton>
              )}
              <Avatar
                src={
                  otherUser.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=random`
                }
                alt={otherUser.name}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {otherUser.name}
                </Typography>
                <Typography variant="caption">Online</Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </Paper>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, backgroundColor: '#f5f5f5' }}>
          <List>
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: msg.sender === currentUser.name ? 'flex-end' : 'flex-start',
                  mb: 2,
                  px: 0,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: msg.sender === currentUser.name ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1,
                  }}
                >
                  {msg.senderAvatar && msg.sender !== currentUser.name && (
                    <Avatar src={msg.senderAvatar} alt={msg.sender} sx={{ width: 32, height: 32 }} />
                  )}
                  <Box
                    sx={{
                      backgroundColor:
                        msg.sender === currentUser.name
                          ? 'primary.main'
                          : msg.sender === 'System'
                          ? 'grey.300'
                          : 'white',
                      color: msg.sender === currentUser.name ? 'white' : 'text.primary',
                      borderRadius: 2,
                      p: 1.5,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.8,
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Message Input */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                backgroundColor: message.trim() ? 'primary.main' : 'grey.200',
                color: message.trim() ? 'white' : 'grey.500',
                '&:hover': {
                  backgroundColor: message.trim() ? 'primary.dark' : 'grey.300',
                },
                borderRadius: 2,
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Drawer>
  );
};

export default ChatInterface;