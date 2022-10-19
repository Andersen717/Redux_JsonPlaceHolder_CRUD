import {
  Form,
  Input,
  InputNumber,
  Table,
  Typography,
  Button,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, editUser, deleteUser } from "../redux/actions/userAction";

import "./UserList.css";

const { confirm } = Modal;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const users = useSelector((state) => state.user.users);
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (key) => {
    handleDelete(key);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const handleDelete = (key) => {
    // const newData = data.filter((item) => item.key !== key);
    dispatch(deleteUser(key));
    // setData(newData);
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
        // setData(newData);
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
            type="primary"
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
      render: (_, record) =>
        data.length >= 1 ? (
          <>
            <Button className="delete-btn" onClick={showModal}>
              delete
            </Button>
            <Modal
              title="Delete"
              open={isModalOpen}
              onOk={handleOk(record.key)}
              onCancel={handleCancel}
            >
              <p>Are you sure delete this user?</p>
            </Modal>
          </>
        ) : null,
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
