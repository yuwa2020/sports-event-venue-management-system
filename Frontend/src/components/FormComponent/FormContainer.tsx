import React from "react";
import { Box, Button, Container, Typography} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import './FormContainer.css'; 

const FormContainer = ({ title, children, socialAction}: { title: string; children: React.ReactNode; socialAction: string}) => {
    return(
        <Container maxWidth={false} className="form-container">
            <Container className="left-container">
                <Box className="teamup-logo">
                    TeamUp
                </Box>
                <Box className="description-text">
                    Discover Tailored <br /> Venues. <br /> Sign Up for personalized  <br /> recommendations <br /> today!
                </Box>
            </Container>
            <Container className="right-container">
                <Container className="inner-container">
                    <Box className='form-header'>
                        <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                            {title}
                        </Typography>
                    </Box>
                    <Container className="social-buttons">
                        <Button variant="outlined" size="large" startIcon={<GoogleIcon />} className="social-button"  onClick={() => window.location.href = 'http://localhost:3000/auth/google'}> {socialAction} with Google </Button>
                        <Button variant="outlined" size="large" startIcon={<FacebookIcon />} className="social-button"> {socialAction} with Facebook </Button>
                    </Container>
                    <Box className="divider">
                        <Box className="divider-line"/>
                        <Box className="or-text">OR</Box>
                        <Box className="divider-line"/>
                    </Box>
                    <Box className="input-fields">
                        {children}
                    </Box>
                    <Box className="footer-text">
                        {socialAction === "Sign Up" ? (
                            <>Already have an account? <a href="/login">Log in</a></>
                        ) : (
                            <>Don't have an account? <a href="/register">Sign up</a></>
                        )}
                    </Box>  
                </Container>
            </Container>
        </Container>
    );
}

export default FormContainer;