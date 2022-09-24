import React, { useContext } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { IndentityContext } from "../context/authContext";
import Layout from "../Layout/layout";
import { Button } from "react-bootstrap";


export default function Home() {

  const { user, identity } = useContext(IndentityContext);

  return (
    <Layout>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "90vh" }}>
        <h3 className="w-25">Welcome To Todo App!!!</h3>
        <Button variant="dark" className="w-25" onClick={() => {identity.open()}}>Get Started</Button>
      </div>
    </Layout>
  );
}
