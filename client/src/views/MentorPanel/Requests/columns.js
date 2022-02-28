import React from "react";

export const requestsColumns = [
  {
    title: "Training",
    dataIndex: "training",
    key: "training",
  },
  {
    title: "Student ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: 'Dates',
    dataIndex: 'dates',
    key: 'dates',
    render: (record) => (
      record.map(i => (
        <p>{i}</p>
      ))

    ),
  },
];
