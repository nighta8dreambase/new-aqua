import React, { useEffect, useState } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { useListPushData } from "../../services/api/setting/useListPushData";
import { Box, Button, CircularProgress, Container, Divider, FilledInput, FormControl, FormControlLabel, Grid, makeStyles, Paper, Radio, RadioGroup, TextField } from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import edit from "../../components/assets/edit.svg";
import remove from "../../components/assets/remove.svg";
import { Theme } from "@emotion/react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

export const CreatePushData = observer((props: any) => {
    const mobile = webStore.device === 'mobile'

    const useStyles = makeStyles((theme: Theme) => ({
        radio: {
            '&$checked': {
                color: 'var(--primary)'
            }
        },
        checked: {},
        label: {
            color: 'var(--gray)'
        },
        textfield: {
            height: 10,
            fontSize: 14,
        },
        toggleBtn: {
            border: 'none',
            color: 'var(--hard-gray)',
            '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'white'
            }
        },
        toggleBtnSelect: {
            backgroundColor: 'white !important',
            color: 'var(--primary) !important',
            fontWeight: 700
        },
        toggleGroupBtn: {
            border: '1px solid #c4c4c4',
        }
    }));

    const classes = useStyles();

    const [device, setDevice] = useState('ANY_DEVICE');
    const [time, setTime] = useState('IMMEDIATELY');
    const [IMEI, setIMEI]: any = useState();
    const [IMEIGroup, setIMEIGroup]: any = useState();
    const [message, setMessage]: any = useState();
    const [date, setDate]: any = useState();
    const [days, setDays]: any = useState([]);
    const [time2, setTime2]: any = useState('16:00');

    const handleChangeDevice = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDevice((event.target as HTMLInputElement).value);
    };

    const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTime((event.target as HTMLInputElement).value);
    };

    const handleDays = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
        setDays(newDays);
    };

    return (
        mobile ? <CreatePushDataMobile device={device} handleChangeDevice={handleChangeDevice} classes={classes} IMEI={IMEI} setIMEI={setIMEI} IMEIGroup={IMEIGroup} setIMEIGroup={setIMEIGroup} message={message} setMessage={setMessage} time={time} handleChangeTime={handleChangeTime} date={date} setDate={setDate} days={days} setDays={setDays} handleDays={handleDays} time2={time2} setTime2={setTime2} /> :
            <CreatePushDataDesktop device={device} handleChangeDevice={handleChangeDevice} classes={classes} IMEI={IMEI} setIMEI={setIMEI} IMEIGroup={IMEIGroup} setIMEIGroup={setIMEIGroup} message={message} setMessage={setMessage} time={time} handleChangeTime={handleChangeTime} date={date} setDate={setDate} days={days} setDays={setDays} handleDays={handleDays} time2={time2} setTime2={setTime2} />
    );
});

export const CreatePushDataDesktop = observer(({ device, handleChangeDevice, classes, IMEI, setIMEI, IMEIGroup, setIMEIGroup, message, setMessage, time, handleChangeTime, date, setDate, days, setDays, handleDays, time2, setTime2 }: any) => {

    return (
        <Container maxWidth="xl" className="py-4">
            <Grid container spacing={3}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <Box mb={2}>
                        <SubBar back={true} reload={false} title={"Create Push Data"} />
                    </Box >
                    <Grid container item xs={12} justify="center">
                        <Paper css={{ width: '100%' }}>
                            <Box mb={4}>
                                <Box fontSize={14} my={2} display="flex" px={3}>
                                    <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box mt={1} fontWeight={500}>Device</Box></Grid>
                                    <Grid container item xs={10} css={{ fontSize: 14 }}>
                                        <RadioGroup aria-label="device" name="device" value={device} onChange={handleChangeDevice} css={{ width: '100%' }}>
                                            <FormControlLabel value="ANY_DEVICE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "ANY_DEVICE" ? "var(--primary)" : "var(--hard-gray)" }}>Any Device</Box>} />
                                            <FormControlLabel value="SPECIFIC_DEVICE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "SPECIFIC_DEVICE" ? "var(--primary)" : "var(--hard-gray)" }}>Specific Device</Box>} />
                                            {device === 'SPECIFIC_DEVICE' ? <Box my={1}>
                                                <TextField id="IMEI" autoFocus placeholder="Enter IMEI" variant="outlined" css={{ width: '100%' }} value={IMEI} onChange={(e) => { setIMEI(e.target.value) }} InputProps={{ classes: { input: classes.textfield } }} />
                                            </Box> : ''}
                                            <FormControlLabel value="IMEI_GROUP" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "IMEI_GROUP" ? "var(--primary)" : "var(--hard-gray)" }}>IMEI Group</Box>} />
                                            {device === 'IMEI_GROUP' ? <Box my={1}>
                                                <TextField id="IMEITAG" autoFocus placeholder="Enter IMEI TAG" variant="outlined" css={{ width: '100%' }} value={IMEIGroup} onChange={(e) => { setIMEIGroup(e.target.value) }} InputProps={{ classes: { input: classes.textfield } }} />
                                            </Box> : ''}
                                        </RadioGroup>
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box fontSize={14} my={2} display="flex" alignItems="center" px={3}>
                                    <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Message</Box></Grid>
                                    <Grid container item xs={10}>
                                        <Box my={1} css={{ width: '100%' }}>
                                            <TextField id="messsage" placeholder="Enter message" value={message} onChange={(e) => { setMessage(e.target.value) }} variant="outlined" css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                        </Box>
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box fontSize={14} my={2} display="flex" px={3}>
                                    <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box mt={1} fontWeight={500}>Time</Box></Grid>
                                    <Grid container item xs={10}>
                                        <Grid container item xs={10} css={{ fontSize: 14 }}>
                                            <RadioGroup aria-label="time" name="time" value={time} onChange={handleChangeTime}>
                                                <FormControlLabel value="IMMEDIATELY" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "IMMEDIATELY" ? "var(--primary)" : "var(--hard-gray)" }}>Immidiately</Box>} />
                                                <FormControlLabel value="SCHEDULE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "SCHEDULE" ? "var(--primary)" : "var(--hard-gray)" }}>Schedule</Box>} />
                                                <FormControlLabel value="INTERVAL" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "INTERVAL" ? "var(--primary)" : "var(--hard-gray)" }}>Interval</Box>} />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                </Box>
                                {time === "SCHEDULE" ? <Box>
                                    <Divider />
                                    <Box fontSize={14} mt={2} display="flex" flexDirection="column" px={3}>
                                        <Grid item xs={12}><Box mt={1} fontSize={16} fontWeight={500}>Schedule setting</Box></Grid>
                                        <Box mt={2}>
                                            <Grid container item xs={12} direction="row" alignItems="center">
                                                <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Date</Box></Grid>
                                                <Grid item xs={10}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="date" id="date" placeholder='Select date' value={date} onChange={(e) => { setDate(e.target.value) }} variant="outlined" css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Time</Box></Grid>
                                                <Grid item xs={2}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="time" id="time" defaultValue="16:00" variant="outlined" value={time2} onChange={(e) => { setTime2(e.target.value) }} css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box> : ''}
                                {time === "INTERVAL" ? <Box>
                                    <Divider />
                                    <Box fontSize={14} mt={2} display="flex" flexDirection="column" px={3}>
                                        <Grid item xs={12}><Box mt={1} fontSize={16} fontWeight={500}>Interval setting</Box></Grid>
                                        <Box mt={2}>
                                            <Grid container item xs={12} direction="row" alignItems="center">
                                                <Grid container item xs={12} direction="row" alignItems="center">
                                                    <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Day</Box></Grid>
                                                    <Grid item xs={10}>
                                                        <Box my={1} css={{ width: '100%' }}>
                                                            <Grid item sm={12} md={6}>
                                                                <ToggleButtonGroup value={days} onChange={handleDays} aria-label="text days" classes={{ root: classes.toggleGroupBtn }}>
                                                                    <ToggleButton value="MON" aria-label="MON" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>MON</ToggleButton>
                                                                    <ToggleButton value="TUE" aria-label="TUE" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>TUE</ToggleButton>
                                                                    <ToggleButton value="WED" aria-label="WED" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>WED</ToggleButton>
                                                                    <ToggleButton value="THU" aria-label="THU" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>THU</ToggleButton>
                                                                    <ToggleButton value="FRI" aria-label="FRI" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>FRI</ToggleButton>
                                                                    <ToggleButton value="SAT" aria-label="SAT" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>SAT</ToggleButton>
                                                                    <ToggleButton value="SUN" aria-label="SUN" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>SUN</ToggleButton>
                                                                </ToggleButtonGroup>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs={2}></Grid>
                                                        <Box className="cursor-pointer select-none" css={{ color: 'var(--primary)' }} fontWeight={600} mb={2} onClick={() => { days.length === 7 ? setDays([]) : setDays(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) }}>Toggle every day</Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={2} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Time</Box></Grid>
                                                <Grid item xs={2}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="time" id="time" defaultValue="16:00" variant="outlined" value={time2} onChange={(e) => { setTime2(e.target.value) }} css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box> : ''}
                                <Box display="flex" px={3} mt={3}>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={10}>
                                        <Button variant="contained" css={{ textTransform: 'none', backgroundColor: 'var(--success)', color: 'white', width: '50%', height: 50, fontWeight: 700 }}>Submit</Button>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
})

export const CreatePushDataMobile = observer(({ device, handleChangeDevice, classes, IMEI, setIMEI, IMEIGroup, setIMEIGroup, message, setMessage, time, handleChangeTime, date, setDate, days, setDays, handleDays, time2, setTime2 }: any) => {

    return (
        <Container maxWidth="xl" className="py-4">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box mb={2}>
                        <SubBar back={true} reload={false} title={"Create Push Data"} />
                    </Box >
                    <Grid container item xs={12} justify="center">
                        <Paper css={{ width: '100%' }}>
                            <Box mb={4}>
                                <Box fontSize={14} my={2} display="flex" px={3}>
                                    <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box mt={1} fontWeight={500}>Device</Box></Grid>
                                    <Grid container item xs={8} css={{ fontSize: 14 }}>
                                        <RadioGroup aria-label="device" name="device" value={device} onChange={handleChangeDevice} css={{ width: '100%' }}>
                                            <FormControlLabel value="ANY_DEVICE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "ANY_DEVICE" ? "var(--primary)" : "var(--hard-gray)" }}>Any Device</Box>} />
                                            <FormControlLabel value="SPECIFIC_DEVICE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "SPECIFIC_DEVICE" ? "var(--primary)" : "var(--hard-gray)" }}>Specific Device</Box>} />
                                            {device === 'SPECIFIC_DEVICE' ? <Box my={1}>
                                                <TextField id="IMEI" autoFocus placeholder="Enter IMEI" variant="outlined" css={{ width: '100%' }} value={IMEI} onChange={(e) => { setIMEI(e.target.value) }} InputProps={{ classes: { input: classes.textfield } }} />
                                            </Box> : ''}
                                            <FormControlLabel value="IMEI_GROUP" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: device === "IMEI_GROUP" ? "var(--primary)" : "var(--hard-gray)" }}>IMEI Group</Box>} />
                                            {device === 'IMEI_GROUP' ? <Box my={1}>
                                                <TextField id="IMEITAG" autoFocus placeholder="Enter IMEI TAG" variant="outlined" css={{ width: '100%' }} value={IMEIGroup} onChange={(e) => { setIMEIGroup(e.target.value) }} InputProps={{ classes: { input: classes.textfield } }} />
                                            </Box> : ''}
                                        </RadioGroup>
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box fontSize={14} my={2} display="flex" alignItems="center" px={3}>
                                    <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Message</Box></Grid>
                                    <Grid container item xs={8}>
                                        <Box my={1} css={{ width: '100%' }}>
                                            <TextField id="messsage" placeholder="Enter message" value={message} onChange={(e) => { setMessage(e.target.value) }} variant="outlined" css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                        </Box>
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box fontSize={14} my={2} display="flex" px={3}>
                                    <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box mt={1} fontWeight={500}>Time</Box></Grid>
                                    <Grid container item xs={8}>
                                        <Grid container item xs={10} css={{ fontSize: 14 }}>
                                            <RadioGroup aria-label="time" name="time" value={time} onChange={handleChangeTime}>
                                                <FormControlLabel value="IMMEDIATELY" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "IMMEDIATELY" ? "var(--primary)" : "var(--hard-gray)" }}>Immidiately</Box>} />
                                                <FormControlLabel value="SCHEDULE" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "SCHEDULE" ? "var(--primary)" : "var(--hard-gray)" }}>Schedule</Box>} />
                                                <FormControlLabel value="INTERVAL" control={<Radio classes={{ root: classes.radio, checked: classes.checked }} size='small' />} label={<Box fontSize={14} css={{ color: time === "INTERVAL" ? "var(--primary)" : "var(--hard-gray)" }}>Interval</Box>} />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                </Box>
                                {time === "SCHEDULE" ? <Box>
                                    <Divider />
                                    <Box fontSize={14} mt={2} display="flex" flexDirection="column" px={3}>
                                        <Grid item xs={12}><Box mt={1} fontSize={16} fontWeight={500}>Schedule setting</Box></Grid>
                                        <Box mt={2}>
                                            <Grid container item xs={12} direction="row" alignItems="center">
                                                <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Date</Box></Grid>
                                                <Grid item xs={8}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="date" id="date" placeholder='Select date' value={date} onChange={(e) => { setDate(e.target.value) }} variant="outlined" css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Time</Box></Grid>
                                                <Grid item xs={6}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="time" id="time" defaultValue="16:00" variant="outlined" value={time2} onChange={(e) => { setTime2(e.target.value) }} css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box> : ''}
                                {time === "INTERVAL" ? <Box>
                                    <Divider />
                                    <Box fontSize={14} mt={2} display="flex" flexDirection="column" px={3}>
                                        <Grid item xs={12}><Box mt={1} fontSize={16} fontWeight={500}>Interval setting</Box></Grid>
                                        <Box mt={2}>
                                            <Grid container item xs={12} direction="row" alignItems="center">
                                                <Grid container item xs={12} direction="row" alignItems="center">
                                                    <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Day</Box></Grid>
                                                    <Grid item xs={4}>
                                                        <Box my={1} css={{ width: '100%' }}>
                                                            <Grid item sm={12} md={6}>
                                                                <ToggleButtonGroup orientation="vertical" value={days} onChange={handleDays} aria-label="text days" classes={{ root: classes.toggleGroupBtn }}>
                                                                    <ToggleButton value="MON" aria-label="MON" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>MON</ToggleButton>
                                                                    <ToggleButton value="TUE" aria-label="TUE" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>TUE</ToggleButton>
                                                                    <ToggleButton value="WED" aria-label="WED" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>WED</ToggleButton>
                                                                    <ToggleButton value="THU" aria-label="THU" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>THU</ToggleButton>
                                                                    <ToggleButton value="FRI" aria-label="FRI" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>FRI</ToggleButton>
                                                                    <ToggleButton value="SAT" aria-label="SAT" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>SAT</ToggleButton>
                                                                    <ToggleButton value="SUN" aria-label="SUN" classes={{ root: classes.toggleBtn, selected: classes.toggleBtnSelect }}>SUN</ToggleButton>
                                                                </ToggleButtonGroup>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                    <Grid container xs={4}>
                                                        <Box className="cursor-pointer select-none" css={{ color: 'var(--primary)' }} fontWeight={600} mb={2} onClick={() => { days.length === 7 ? setDays([]) : setDays(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) }}>Toggle<br />everyday</Box>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={4} css={{ color: 'var(--hard-gray)' }}><Box fontWeight={500}>Time</Box></Grid>
                                                <Grid item xs={6}>
                                                    <Box my={1} css={{ width: '100%' }}>
                                                        <TextField type="time" id="time" defaultValue="16:00" variant="outlined" value={time2} onChange={(e) => { setTime2(e.target.value) }} css={{ width: '100%' }} InputProps={{ classes: { input: classes.textfield } }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box> : ''}
                                <Box display="flex" px={3} mt={3}>
                                    <Grid container item xs={12} justify="center">
                                        <Button variant="contained" css={{ textTransform: 'none', backgroundColor: 'var(--success)', color: 'white', width: '50%', height: 50, fontWeight: 700 }}>Submit</Button>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Container >
    )
})