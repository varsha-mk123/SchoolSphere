import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ActionMenu from "./ActionMenu"; // Ensure you have this component

// Styled SpeedDial component
const StyledSpeedDial = styled(SpeedDial)`
  .MuiSpeedDial-fab {
    background-color: #240439;
    &:hover {
      background-color: #440080;
    }
  }
`;

const MyComponent = ({ row, actions }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state on first render
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <ActionMenu row={row} actions={actions} />
      ) : (
        <StyledSpeedDial
          ariaLabel="SpeedDial playground example"
          icon={<SpeedDialIcon />}
          direction="right"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </StyledSpeedDial>
      )}
    </>
  );
};

export default MyComponent;
