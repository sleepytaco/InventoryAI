import { Box, Stack, Typography } from "@mui/material";

const items = [
    'potato',
    'carrot',
    'bat',
    'garlic',
    'beetroot',
];

export default function Home() {
    return (
    <Box width="100vw" height="100vh" display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
        <Box width="800px" height={"100px"}>
            <Typography variant="h2" textAlign={"center"}>
                Pantry Items
            </Typography>
        </Box>
        <Stack width="800px" height="600px" spacing={2} overflow={"auto"}>
            {items.map((item, idx) => (
                <Box 
                    key={idx} 
                    width="100%" 
                    height="100px" 
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bgcolor={"#f0f0f0"}
                    >
                    <Typography variant="h3">
                    {item}
                    </Typography>
                </Box>
            ))}
        </Stack>
    </Box>
    );
}