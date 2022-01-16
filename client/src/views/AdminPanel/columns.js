import React from "react";

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
        render: (text, record) => (
          <a href={`/admin/user?id=${text}`}>{text}</a>
        ),
      },
    {
        title: "Mentor",
        dataIndex: "mentor",
        key: "mentor",
        render: (text, record) => (
            text ? "Si":"No"
          ),
      },
    {
        title: "Admin",
        dataIndex: "admin",
        key: "admin",
        render: function(text, record, index) {
            return text ? "Si":"No"; 
        }	
    },
  ];
  