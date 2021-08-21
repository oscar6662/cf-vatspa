import React from "react";

export const userColumns = [
    {
        title: "CID",
        dataIndex: "id",
        key: "id",
        render: (text, record) => (
          <a href={`/admin/user?id=${text}`}>{text}</a>
        ),
      },
    {
        title: "Training",
        dataIndex: "training",
        key: "training",
      },
    {
        title: "Fechas",
        dataIndex: "availabledates",
        key: "fechas",
    },
  ];
  