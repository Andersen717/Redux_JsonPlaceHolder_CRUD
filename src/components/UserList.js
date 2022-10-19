import {
  Form,
  Input,
  InputNumber,
  Table,
  Typography,
  Button,
  Modal,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, editUser, deleteUser } from "../redux/actions/userAction";

import "./UserList.css";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={
            dataIndex === "email"
              ? [
                  { required: true, message: `Please Input ${title}!` },
                  { type: "email", message: "Please Input Valid Email" },
                ]
              : [
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ]
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const UserList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [deletingKey, setDeletingKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (users.length) {
      setData(
        users.map((user) => {
          return {
            ...user,
            key: user.id,
            tcity: user.address ? user.address.city : "",
          };
        })
      );
    }
  }, [users]);

  if (loading)
    return (
      <div className="card-content">
        <Spin />
      </div>
    );

  const showDeleteModal = (key) => {
    setDeletingKey(key);
    setIsModalOpen(true);
  };

  const handleOk = (key) => {
    dispatch(deleteUser(key));
    setEditingKey("");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      name: "",
      username: "",
      email: "",
      city: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        let resItem = { ...item, ...row };
        delete resItem.tcity;
        delete resItem.key;
        dispatch(editUser(resItem));
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      width: "10%",
      editable: true,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "10%",
      editable: true,
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "10%",
      editable: true,
      align: "center",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
      editable: true,
      align: "center",
    },
    {
      title: "City",
      dataIndex: "tcity",
      width: "10%",
      editable: true,
      align: "center",
    },
    {
      title: "Edit",
      dataIndex: "edit",
      align: "center",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link
              onClick={cancel}
              style={{
                marginRight: 8,
              }}
            >
              Cancel
            </Typography.Link>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            className="edit-btn"
          >
            edit
          </Button>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return data.length >= 1 ? (
          <>
            <Button
              className="btn delete-btn"
              onClick={() => showDeleteModal(record.key)}
            >
              delete
            </Button>
            <Modal
              title="Delete"
              open={isModalOpen && record.key === deletingKey}
              onOk={() => handleOk(record.key)}
              onCancel={handleCancel}
              footer={[
                <Button
                  key="back"
                  className="modal-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  className="modal-delete-btn"
                  type="primary"
                  loading={loading}
                  onClick={() => handleOk(record.key)}
                >
                  Delete
                </Button>,
              ]}
            >
              <p>Are you sure delete this user?</p>
            </Modal>
          </>
        ) : null;
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default UserList;
