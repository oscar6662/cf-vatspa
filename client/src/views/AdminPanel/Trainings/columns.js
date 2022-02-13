import React from "react";
import { Link } from "react-router-dom";

export const trainingColumns = [
    {
        title: "Training (long)",
        dataIndex: "long",
        key: "long",
    },
    {
        title: "Training (short)",
        dataIndex: "short",
        key: "short",
    },
    {
        title: "Requires",
        dataIndex: "requires",
        key: "requires",
    },
    {
        title: "Unlocks",
        dataIndex: "unlocks",
        key: "unlocks",
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (record) => (
            <Link to={{ pathname: "/admin/training/edit", state: { record } }}>
                Edit
            </Link>
        ),
    },
];
