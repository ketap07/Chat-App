import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, registerLoading } = useContext(AuthContext)
    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{
                    height: "100vh",
                    justifyContent: "center",
                    paddingTop: "10%"


                }}>
                    <Col xs={6}>
                        {/* as it align the element vertically  */}
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
                            <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />

                            <Button variant="primary" type="submit">
                                {registerLoading ? "Creating  your accout" : "Register"}
                            </Button>

                            {/* && opertaor for conditional rendering  ? . is used  optional changing   it use to handle   object when it is null or undefine  , the expression will return undefined without throwing an  error  */}

                            {registerError?.error && (
                                <Alert variant="danger">
                                    <p>
                                        {registerError?.message}
                                    </p>
                                </Alert>
                            )}

                        </Stack>
                    </Col>
                </Row>



            </Form>
        </>)
};

export default Register;