import { Card } from "antd";
import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <Card className="card" title="User list" extra={<AddUser />}>
      <UserList />
    </Card>
  );
}
