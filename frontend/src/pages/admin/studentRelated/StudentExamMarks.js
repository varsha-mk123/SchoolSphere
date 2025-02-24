import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    // Fetch Student Details
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
    }, [situation, params, dispatch]);

    // Fetch Subject List (Only if Student's class is available)
    useEffect(() => {
        if (userDetails?.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails, situation]);

    // Handle Subject Selection Change
    const changeHandler = (event) => {
        if (!subjectsList) return;
        const selectedSubject = subjectsList.find((subject) => subject.subName === event.target.value);
        if (selectedSubject) {
            setSubjectName(selectedSubject.subName);
            setChosenSubName(selectedSubject._id);
        }
    };

    // Fields for Update
    const fields = { subName: chosenSubName, marksObtained };

    // Handle Form Submission
    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
    };

    // Handle Response & Errors
    useEffect(() => {
        if (response || error || statestatus === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage(response || error || "Done Successfully");
        }
    }, [response, error, statestatus]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
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
                                    Student Name: {userDetails?.name || "N/A"}
                                </Typography>
                                {currentUser.teachSubject && (
                                    <Typography variant="h4">
                                        Subject Name: {currentUser.teachSubject?.subName}
                                    </Typography>
                                )}
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    {situation === "Student" && (
                                        <FormControl fullWidth>
                                            <InputLabel id="subject-select-label">Select Subject</InputLabel>
                                            <Select
                                                labelId="subject-select-label"
                                                id="subject-select"
                                                value={subjectName}
                                                onChange={changeHandler}
                                                required
                                            >
                                                {subjectsList?.length > 0 ? (
                                                    subjectsList.map((subject, index) => (
                                                        <MenuItem key={index} value={subject.subName}>
                                                            {subject.subName}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No Subjects Available</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    )}
                                    <FormControl>
                                        <TextField
                                            type="number"
                                            label="Enter marks"
                                            value={marksObtained}
                                            required
                                            onChange={(e) => setMarksObtained(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </FormControl>
                                </Stack>
                                <BlueButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                </BlueButton>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            )}
        </>
    );
};

export default StudentExamMarks;
