"use client"

import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase"
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore"

const items = [
    'potato',
    'carrot',
    'bat',
    'garlic',
    'beetroot',
];

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false); // for modal
    const [itemName, setItemName] = useState("")

    // this is a helper function to use our db instance to connect to inventory collection
    // and get any docs from it
    const updateInventory = async () => {
        const snapshot = query(collection(db, 'inventory')) // get a snapshot of our 'inventory' collection
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        // console.log(inventoryList)
        setInventory(inventoryList)
    };

    // useEffect is where we actually call our helper function
    useEffect(() => {
        updateInventory()
    }, []); // empty dependency array means this useEffect runs once when the component mounts
    
    const removeItem = async (item) => {
        const docRef = doc(collection(db, 'inventory'), item) // this gets the direct item ref
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 })
            }
        }

        await updateInventory() 
    }

    const addItem = async (item) => {
        const docRef = doc(collection(db, 'inventory'), item) // this gets the direct item ref
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1 })
        } else {
            await setDoc(docRef, { quantity: 1 })
        }

        await updateInventory() 
    }

    // modal
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
    <Box width="100vw" height="100vh" display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
        <Stack spacing={1} width="800px" height={"100px"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"}>
            <Typography variant="h2" textAlign={"center"}>
                Pantry Items
            </Typography>
            <Button variant="contained" onClick={handleOpen}>
                Add Item
            </Button>
        </Stack>
        <Modal open={open} onClose={handleClose}> 
            <Box
                position={"absolute"}
                top={"50%"}
                left={"50%"}
                transform="translate(-50%, -50%)" // center it even more
                width={400}
                bgcolor={"white"}
                border="2px solid black"
                boxShadow={24}
                p={4}
                display="flex"
                flexDirection={"column"}
                gap={3}
                sx={{ // sometimes the variable transform is not supported by MUI, so sx allows you to explicitly specify a styling
                    transform: "translate(-50%, -50%)"
                }}
            >
                <Typography variant="h6">Add Item</Typography>
                <Stack width={"100%"} direction={"row"} spacing={2}>
                    <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => {
                        setItemName(e.target.value)
                    }}/>
                    <Button variant="outlined" onClick={() => {
                        addItem(itemName)
                        setItemName("")
                        handleClose()
                    }}>Add</Button>
                </Stack>
            </Box>
        </Modal>
        <Stack width="800px" height="600px" spacing={2} overflow={"auto"}>
            {
                inventory.map(({name, quantity}) => (
                    <Box 
                    key={name} 
                    width="100%" 
                    minHeight="150px" 
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    bgcolor={"#f0f0f0"}
                    padding={5}
                    >
                        <Typography variant="h3">
                        {name}, {quantity}
                        </Typography>
                        <Stack direction={"row"} spacing={2}>
                            <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                            <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                        </Stack>
                    </Box>
                ))
            }
        </Stack>
    </Box>
    );
}