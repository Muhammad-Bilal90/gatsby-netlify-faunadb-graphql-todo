import React from 'react';
import Layout from '../Layout/layout';
import TodosArea from '../components/todos';
import { Router } from "@reach/router";

export default function Dashboard() {

    return (
        <Layout>
            <Router>
                <TodosArea path="/dashboard" />
            </Router>
        </Layout>
    );
}