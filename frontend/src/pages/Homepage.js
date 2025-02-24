import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

// Replace with your actual file paths for these images:
import ChatbotIconImage from "../assets/chatbot.svg";
import LanguageIconImage from "../assets/language.svg";

const Homepage = () => {
  return (
    <StyledContainer>
      {/* Language Selector at top-right */}
      <LanguageSelectorWrapper>
        <LanguageIcon src={LanguageIconImage} alt="Language Selector" />
        <LanguageDropdown>
          <option value="en">English</option>
          <option value="kn">Kannada</option>
          <option value="hi">Hindi</option>
        </LanguageDropdown>
      </LanguageSelectorWrapper>

      {/* Chatbot Icon at bottom-right */}
      <ChatbotIcon src={ChatbotIconImage} alt="AI Chatbot" />

      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <img src={Students} alt="students" style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <StyledTitle>
              Welcome to
              <br />
              School Sphere
              <br />
              System
            </StyledTitle>
            <StyledText>
              An easy-to-use system for parents to be aware of their child's progress academic and non-academic.
              Multilingual Support
              Low-Tech
              Good-to-have tasks:
              Notice and Complaint board
              <br />
              AI chatbot
            </StyledText>
            <StyledBox>
              <StyledLink to="/choose">
                <LightPurpleButton variant="contained" fullWidth>
                  Login
                </LightPurpleButton>
              </StyledLink>
              <StyledLink to="/chooseasguest">
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                >
                  Login as Guest
                </Button>
              </StyledLink>
              <StyledText>
                Don't have an account?{' '}
                <Link to="/Adminregister" style={{ color: "#550080" }}>
                  Sign up
                </Link>
              </StyledText>
            </StyledBox>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Homepage;

/* --- STYLED COMPONENTS --- */

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative; /* allows absolute positioning for icons */
`;

const StyledPaper = styled.div`
  padding: 24px;
  height: 100vh;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  margin-top: 30px;
  margin-bottom: 30px;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

/* --- NEW ICONS --- */

/* Chatbot icon in bottom-right corner */
const ChatbotIcon = styled.img`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: auto;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 40px;
    bottom: 10px;
    right: 10px;
  }
`;

/* Language selector at top-right */
const LanguageSelectorWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    top: 10px;
    right: 10px;
  }
`;

const LanguageIcon = styled.img`
  width: 30px;
  height: auto;
  margin-right: 8px;

  @media (max-width: 600px) {
    width: 25px;
  }
`;

const LanguageDropdown = styled.select`
  background: #ffffff;
  color: #000;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  outline: none;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
