import React from "react";
import { Link } from "react-router-dom";

export const userColumns = [
  {
    title: "Name",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "CID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Mentor",
    dataIndex: "mentor",
    key: "mentor",
    render: (text) => (
      text ? "Si" : "No"
    ),
  },
  {
    title: "Admin",
    dataIndex: "admin",
    key: "admin",
    render: function (text) {
      return text ? "Si" : "No";
    }
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: (record) => (
        <Link to={{ pathname: "/admin/user", state: { record } }}>
            Edit
        </Link>
    ),
},
];
