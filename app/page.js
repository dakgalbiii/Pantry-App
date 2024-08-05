"use client"
import React from "react";
import { Box, Button, Stack, Typography, TextField, IconButton, Modal, SpeedDial, SpeedDialAction } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "@firebase/firestore";
import { firestore } from "@/firebase";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [inventory, setInventory] = React.useState([])
  const [itemName, setItemName] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  React.useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
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

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (
    <Box
      width={"100%"}
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      bgcolor={"#f0f0f0"}
      paddingBottom={"8rem"}
      sx={{ overflowX: "hidden" }}
    >
      <Box bgcolor={"#fff"} width={"100vw"} height={"15rem"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"start"} paddingX={"2rem"} paddingY={"1rem"} marginBottom={"3rem"} gap={"2rem"}>
        <Typography variant="h3" color={"#333"} textAlign={"center"}>Welcome to your pantry 🍳</Typography>
      </Box>

      <Stack
        width={"800px"}
        spacing={2}
        key={1}
      >
        {inventory.map((item) => (
          <Box
            key={item.name}
            width={"100%"}
            height={"125px"}
            paddingX={"2rem"}
            paddingY={"1.5rem"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"start"}
            bgcolor={"#fff"}
            borderRadius={"25px"}
            boxShadow={1}
            position={"relative"}
          >
            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Typography variant="p" color={"#333"} textAlign={"center"} textTransform={"capitalize"}>{item.name}</Typography>
              <Stack display={"flex"} spacing={"1rem"}>

                <Stack direction={"row"} spacing={"2rem"}>
                  <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Typography variant="p" color={"#333"} textAlign={"center"} textTransform={"capitalize"} marginBottom={"1rem"}>Quantity: {item.quantity}</Typography>
                    <Stack display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                      <Button variant={"outlined"} sx={{ bgcolor: "#64d59a", color: "#fff", border: "0px", marginRight: "1rem", "&:hover": { bgcolor: "#fff", color: "#64d59a", border: "1px solid #64d59a" } }} onClick={() => { addItem(item.name) }}>+</Button>
                      <Button variant={"outlined"} sx={{ bgcolor: "#64d59a", color: "#fff", border: "0px", "&:hover": { bgcolor: "#fff", color: "#64d59a", border: "1px solid #64d59a" } }} onClick={() => { removeItem(item.name) }}>-</Button>
                    </Stack>
                  </Box>
                  <Button variant={"outlined"} sx={{ bgcolor: "#f2725c", color: "#fff", border: "0px", "&:hover": { bgcolor: "#fff", color: "#f2725c", border: "1px solid #f2725c" } }} onClick={() => { deleteItem(item.name) }}>
                    <DeleteForeverIcon />
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        ))
        }
      </Stack >

      <Box width={"100%"} height={"5rem"} bgcolor={"#64d59a"} position={"fixed"} bottom={0} right={0} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
        <IconButton onClick={() => handleOpen()}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box position={"absolute"} left={"50%"} top={"50%"} width={"400"} bgcolor={"#fff"} color={"#333"} boxShadow={24} p={4} display={"flex"} flexDirection={"column"} gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <TextField variant="outlined" fillWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value != "") {
                  addItem(itemName)
                  setItemName("")
                  handleClose()
                }
              }}
            />
            <Button sx={{ color: "#64d59a", borderColor: "#64d59a", "&:hover": { bgcolor: "#64d59a", color: "#fff", border: "1px solid #64d59a" } }} variant="outlined" onClick={
              () => {
                if (itemName != "") {
                  addItem(itemName)
                  setItemName("")
                  handleClose()
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

    </Box >
  );
}