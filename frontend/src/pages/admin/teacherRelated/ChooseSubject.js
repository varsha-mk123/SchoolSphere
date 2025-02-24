import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableContainer, TableHead, Typography, Paper, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            dispatch(getTeacherFreeClassSubjects(params.id));
        } else if (situation === "Teacher") {
            setClassID(params.classID);
            setTeacherID(params.teacherID);
            dispatch(getTeacherFreeClassSubjects(params.classID));
        }
    }, [dispatch, situation, params]);

    const updateSubjectHandler = async (teacherId, teachSubject) => {
        setLoader(true);
        await dispatch(updateTeachSubject(teacherId, teachSubject));
        setLoader(false);
        navigate("/Admin/teachers");
    };

    if (loading) return <div>Loading...</div>;

    if (response && !subjectsList?.length) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" color="error">
                    Sorry, all subjects have teachers assigned already.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <PurpleButton
                        variant="contained"
                        onClick={() => navigate(`/Admin/addsubject/${classID}`)}
                    >
                        Add Subjects
                    </PurpleButton>
                </Box>
            </Box>
        );
    }

    if (error) {
        console.error(error);
        return <Typography color="error">An error occurred while fetching subjects.</Typography>;
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Choose a subject
            </Typography>
            <TableContainer>
                <Table aria-label="subjects table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell align="center">Subject Name</StyledTableCell>
                            <StyledTableCell align="center">Subject Code</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectsList?.length > 0 ? (
                            subjectsList.map((subject, index) => (
                                <StyledTableRow key={subject._id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{subject.subName}</StyledTableCell>
                                    <StyledTableCell align="center">{subject.subCode}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {situation === "Norm" ? (
                                            <GreenButton
                                                variant="contained"
                                                onClick={() => navigate(`/Admin/teachers/addteacher/${subject._id}`)}
                                            >
                                                Choose
                                            </GreenButton>
                                        ) : (
                                            <GreenButton
                                                variant="contained"
                                                disabled={loader}
                                                onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                            >
                                                {loader ? <CircularProgress size={20} color="inherit" /> : 'Choose'}
                                            </GreenButton>
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={4} align="center">
                                    No subjects available.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ChooseSubject;
