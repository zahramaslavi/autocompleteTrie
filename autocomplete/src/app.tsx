import React from 'react';
import AutoField from './components/autoField';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <h1>Autocomplete using trie in the back-end, with Redis</h1>
      <AutoField />
    </Box>
  );
}

export default App;
