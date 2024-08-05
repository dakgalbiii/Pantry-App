import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { Box, dividerClasses, IconButton } from "@mui/material";
import { TextField } from "@mui/material";

const SearchBar = ({ setSearchQuery }) => {
    return (
        <form>
            <TextField
                onInput={(e) => {
                    setSearchQuery(e.target.value);
                }}
                label="Enter an item"
                variant="outlined"
                placeholder="Search..."
            >

            </TextField>
            <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
        </form>
    );
}

export default SearchBar;