import { Button, Modal, Form, Input } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/actions/userAction";

import "./AddUser.css";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState();
  const dispatch = useDispatch();

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onFinish = (form) => {
    dispatch(addUser(form));
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add new
      </Button>
      <Modal
        open={open}
        title="Form"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          validateMessages={validateMessages}
          onFinish={onFinish}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email" }, { required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button danger onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="submit-btn"
              htmlType="submit"
              onClick={handleOk}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddUser;
