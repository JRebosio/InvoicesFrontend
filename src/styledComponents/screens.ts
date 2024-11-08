import styled from "styled-components";
import { Button } from "@mantine/core";

export const StyledContainer = styled.div`
  width: 100vw;
  background-color: #ffffff;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledButton = styled(Button)`
  flex: 1;
  min-width: 100px;
  padding: 8px 16px;
  text-align: center;
`;
