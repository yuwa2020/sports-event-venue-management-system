import React, { useState } from "react";
import { Button, TextField, ToggleButtonGroup, ToggleButton, Typography, Box, Card, CardActionArea, Stack, IconButton } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CardContent from '@mui/material/CardContent';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const Ticketing = () => {
    const cards = [
        {
            id: 1,
            title: 'Ticketed Event',
            description: 'My event requires ticket for entry',
            icon: <ConfirmationNumberIcon fontSize="small" />
        },
        {
            id: 2,
            title: 'Free Event',
            description: 'I\'m running a free event',
            icon: <StarIcon fontSize="small" />
        },
    ];
    const [tickets, setTickets] = useState([{ name: '', price: '' }]);

    const handleAddTicket = () => {
        setTickets([...tickets, { name: '', price: '' }]);
    };
    const handleDeleteTicket = (indexToDelete: number) => {
        const updated = tickets.filter((_, index) => index !== indexToDelete);
        setTickets(updated.length > 0 ? updated : [{ name: '', price: '' }]);
      };
    const [selectedCard, setSelectedCard] = React.useState(0);
    return (
        <div style={{ width: "80%", margin: "10px"}}>
            <h3>What type of event are you running?</h3>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    height: "150px",
                    justifyItems: "center"
                }}
            >
                {cards.map((card, index) => (
                    <Card key={card.id} sx={{ width: 250 }}>
                        <CardActionArea
                            onClick={() => setSelectedCard(index)}
                            data-active={selectedCard === index ? '' : undefined}
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ height: '100%' }}>
                                <Typography>{card.icon}</Typography>
                                <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
            <h3>What type of event are you running?</h3>
            <Stack spacing={2}>
                {tickets.map((ticket, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <div style={{ width: '45%' }}>
                            <Stack spacing={0.5} sx={{ flex: 1 }}>
                                <Typography>Ticket Name</Typography>
                                <TextField size="small" required />
                            </Stack>
                        </div>
                        <div style={{ width: '45%' }}>
                            <Stack spacing={0.5} sx={{ flex: 1 }}>
                                <Typography>Ticket Price</Typography>
                                <TextField type="number" size="small" required />
                            </Stack>
                        </div>
                        <div style={{ width: '10%', display: 'flex', gap: 1 }}>
                            {index === tickets.length - 1 && (
                                <IconButton onClick={handleAddTicket}>
                                    <AddIcon />
                                </IconButton>
                            )}
                            {tickets.length > 1 && (
                                <IconButton onClick={() => handleDeleteTicket(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                    </Box>
                ))}
            </Stack>

        </div>
    );
};

export default Ticketing;