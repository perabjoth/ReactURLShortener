import React, {useState} from 'react';
import {Button, ClickAwayListener,LinearProgress, Tooltip, TextField} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import shrtcode from "../api/shrtcode";

const HTTP_URL_VALIDATOR_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const Search = () => {

    const [link, setLink] = useState("");
    const [short, setShort] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [openToolTip, setOpenToolTip] = useState(false);

    const handleTooltipOpen = () =>{
        setOpenToolTip(true);
        window.setTimeout(()=>{setOpenToolTip(false);}, 500);
    }

    const handleTooltipClose = () =>{
        setOpenToolTip(false);
    }

    const validateURL = (string) => {
        return string.match(HTTP_URL_VALIDATOR_REGEX);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setShort('');
        setError(false);

        if (validateURL(link)) {
            getLink();
        } else {
            setError('Invalid URL');
        }
    }

    const getLink = async () => {
        setIsLoading(true);
        if(localStorage.getItem(link)){
            setShort(localStorage.getItem(link));
            setIsLoading(false);
        }else {
            await shrtcode
                .get(`shorten?url=${link}`)
                .then((response) => {
                    setShort(response.data.result.short_link);
                    setIsLoading(false);
                    localStorage.setItem(link, response.data.result.short_link);
                }).catch((e) => {
                    console.error(e);
                    setIsLoading(false);
                    setError(e.message);
                });
        }
    }

    return (
        <>
            <form>
                <TextField
                    disabled={isLoading}
                    error={error != ''}
                    onSubmit={(e) => {
                        onSubmit(e);
                    }}
                    className="SearchField"
                    label={error ? error : "enter link"}
                    variant="outlined"
                    value={link}
                    onChange={(e) => {
                        setLink(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                />
                {isLoading ? <LinearProgress/> :
                    <Button
                        className='SearchButton'
                        variant='contained'
                        color="primary"
                        onClick={(e) => {
                            onSubmit(e);
                        }}
                        disabled={!link}
                    >
                        Shorten URL
                    </Button>
                }
            </form>
            {short &&
            (<ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip
                    title="Copied"
                    open={openToolTip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    PopperProps={{
                        disablePortal: true,
                    }}
                >
                    <TextField
                        label="Short Link"
                        variant="outlined"
                        disabled
                        color="secondary"
                        value={short}
                        onClick={() => {
                            navigator.clipboard.writeText(short);
                            handleTooltipOpen();
                        }}
                        InputProps={{
                            endAdornment: <FileCopyOutlinedIcon position="end"/>,
                        }}
                    />
                </Tooltip>
            </ClickAwayListener>)}
        </>
    )
}

export default Search;