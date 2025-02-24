import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box, InputLabel, MenuItem, Select,
    Typography, Stack, TextField, CircularProgress,
    FormControl
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector(state => state.user);
    const { subjectsList } = useSelector(state => state.sclass);
    const { response, error, statestatus } = useSelector(state => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    // Fetch student details
    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            dispatch(getUserDetails(params.id, "Student"));
        } else if (situation === "Subject") {
            const { studentID, subjectID } = params;
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation, dispatch, params]);

    // Fetch subjects when userDetails is available
    useEffect(() => {
        if (userDetails?.sclassName?._id && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails?.sclassName?._id, situation]);

    // Handle subject selection
    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(subject => subject.subName === event.target.value);
        if (selectedSubject && selectedSubject._id !== chosenSubName) {
            setSubjectName(selectedSubject.subName);
            setChosenSubName(selectedSubject._id);
        }
    };

    const fields = { subName: chosenSubName, status, date };

    // Submit attendance
    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
    };

    // Handle response messages
    useEffect(() => {
        if (response || error || statestatus === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage(response || "Done Successfully" || "Error occurred");
        }
    }, [response, error, statestatus]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Box
                    sx={{
                        flex: '1 1 auto',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 550,
                            px: 3,
                            py: '100px',
                            width: '100%'
                        }}
                    >
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">
                                Student Name: {userDetails?.name}
                            </Typography>
                            {currentUser?.teachSubject && (
                                <Typography variant="h4">
                                    Subject Name: {currentUser.teachSubject?.subName}
                                </Typography>
                            )}
                        </Stack>
                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                {situation === "Student" && (
                                    <FormControl fullWidth>
                                        <InputLabel id="select-subject-label">Select Subject</InputLabel>
                                        <Select
                                            labelId="select-subject-label"
                                            id="select-subject"
                                            value={subjectName}
                                            label="Choose an option"
                                            onChange={changeHandler}
                                            required
                                            aria-label="Select subject for attendance"
                                        >
                                            {subjectsList?.length > 0 ? (
                                                subjectsList.map((subject, index) => (
                                                    <MenuItem key={index} value={subject.subName}>
                                                        {subject.subName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="" disabled>
                                                    Add Subjects For Attendance
                                                </MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                )}
                                <FormControl fullWidth>
                                    <InputLabel id="select-attendance-label">Attendance Status</InputLabel>
                                    <Select
                                        labelId="select-attendance-label"
                                        id="select-attendance"
                                        value={status}
                                        label="Choose an option"
                                        onChange={(event) => setStatus(event.target.value)}
                                        required
                                        aria-label="Select attendance status"
                                    >
                                        <MenuItem value="Present">Present</MenuItem>
                                        <MenuItem value="Absent">Absent</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Select Date"
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        aria-label="Select attendance date"
                                    />
                                </FormControl>
                            </Stack>

                            <PurpleButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                                aria-label="Submit attendance"
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                            </PurpleButton>
                        </form>
                    </Box>
                </Box>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default StudentAttendance;
