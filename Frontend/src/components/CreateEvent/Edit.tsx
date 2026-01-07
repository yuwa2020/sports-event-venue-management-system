import React from "react";
import { TextField, MenuItem, Typography, Box, RadioGroup, FormControlLabel, Radio, Stack } from "@mui/material";

const Edit: React.FC = () => {
    return (
        <div style={{ width: "75%", padding: "10px", alignContent: "center"}}>
            <h3>Event Details</h3>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%" }}>
                    Event Title <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField fullWidth required style={{ width: "85%" }} />
            </Box>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%",  }}>
                    Event Category <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField fullWidth required style={{ width: "85%" }} />
            </Box>
            <h3>Date and Time</h3>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%",  }}>
                    Event Type <span style={{ color: "red" }}>*</span>
                </Typography>
                <RadioGroup
                    row
                >
                    <FormControlLabel value="single-event" control={<Radio />} label="Single Event" />
                    <FormControlLabel value="recurring-event" control={<Radio />} label="Recurring Event" />
                </RadioGroup>
            </Box>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%",  }}>
                    Session(s) <span style={{ color: "red" }}>*</span>
                </Typography>
                <div style={{ width: "85%", display: "flex" }}>
                    <Stack direction="column" spacing={1} sx={{ flex: 1, margin: "5px" }}>
                        <Typography>Start Date</Typography>
                        <TextField type="date" fullWidth margin="normal" required />
                    </Stack>
                    <Stack direction="column" spacing={1} sx={{ flex: 1, margin: "5px"  }}>
                        <Typography>Start Time</Typography>
                        <TextField type="time" fullWidth margin="normal" required />
                    </Stack>
                    <Stack direction="column" spacing={1} sx={{ flex: 1, margin: "5px"  }}>
                        <Typography>End Time</Typography>
                        <TextField type="time" fullWidth margin="normal" required />
                    </Stack>
                </div>
            </Box>
            <h3>Location</h3>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%",  }}>
                    Where will your event take place?<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField fullWidth required style={{ width: "85%" }} />
            </Box>
            <h3>Additonal Information</h3>
            <Box display="flex" alignItems="center" gap={1} margin={"10px"}>
                <Typography sx={{ width: "15%",  }}>
                    Event Description<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField multiline fullWidth required style={{ width: "85%" }} />
            </Box>
        </div>
    );
};

export default Edit;