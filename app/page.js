"use client"

import { Box, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"
import { collection, deleteDoc, getDoc, getDocs, query, setDoc } from "firebase/firestore"

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

    // useEffect is where we actually call our helper function
    useEffect(() => {
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
            console.log(inventoryList)
        };

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