import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";




const Login = () => {
    const { loginUser,
        logInfo,
        loginError,
        loginLoading,
        updatelogInfo } = useContext(AuthContext)
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{
                    height: "100vh",
                    justifyContent: "center",
                    paddingTop: "10%"


                }}>
                    <Col xs={6}>
                        {/* as it align the element vertically  */}
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Control type="email" placeholder="Email" onChange={(e) => updatelogInfo({ ...logInfo, email: e.target.value })} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { updatelogInfo({ ...logInfo, password: e.target.value }) }} />
                            <Button variant="primary" type="submit">
                                {loginLoading ? "Getting you in ...." : "Login"}
                            </Button>
                            {loginError?.error && (
                                <Alert variant="danger">
                                    <p>
                                        {loginError?.message}
                                    </p>
                                </Alert>
                            )}
                        </Stack>


                    </Col>
                </Row>



            </Form>
        </>)
};

export default Login;