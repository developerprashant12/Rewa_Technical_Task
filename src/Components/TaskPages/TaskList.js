import React, { useState, useEffect } from "react";
import { Container, Navbar, Button, Table, Modal, Form } from "react-bootstrap";
import "./Task.css";
import { useNavigate } from "react-router-dom";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });
  const [formData1, setFormData1] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(2);

  // Logic to get current tasks based on pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3002/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch task data");
        }
        const taskData = await response.json();
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching task data:", error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleView = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData(task);
    setShowEditModal(true);
  };

  const handleDelete = (taskId) => {
    setSelectedTask(taskId);
    setShowConfirmationModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
    setFormData1({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      status: "",
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tasks/${selectedTask}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Update the task list after deletion
      const updatedTasks = tasks.filter((task) => task.id !== selectedTask);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    } finally {
      setSelectedTask(null);
      setShowConfirmationModal(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    props.onLogout();
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/tasks/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update the task list
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTask.id) {
          return formData;
        }
        return task;
      });
      setTasks(updatedTasks);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3002/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData1),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      // Update the task list after adding a new task
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  return (
    <div>
      <Navbar className="bgData">
        <Container fluid>
          <Navbar.Brand>
            <b>TASKLIST Dashboard</b>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button type="submit" className="dataColor" onClick={handleAdd}>
                <b>Add Task</b>
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Pagination Section */}
      <Container className="mt-5">
        <h3>
          Task List
          <hr />
        </h3>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="mt-4">
              <colgroup>
                <col style={{ width: "10%" }} /> {/* Task ID */}
                <col style={{ width: "15%" }} /> {/* Title */}
                <col style={{ width: "30%" }} /> {/* Description */}
                <col style={{ width: "12%" }} /> {/* Due Date */}
                <col style={{ width: "10%" }} /> {/* Status */}
                <col style={{ width: "17%" }} /> {/* Actions */}
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td style={{ textAlign: "justify" }}>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td
                      style={{
                        color: task.status === "Pending" ? "red" : "green",
                      }}
                    >
                      {task.status}
                    </td>
                    <td>
                      <Button onClick={() => handleView(task)} variant="info">
                        View
                      </Button>{" "}
                      <Button
                        onClick={() => handleEdit(task)}
                        variant="warning"
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        onClick={() => handleDelete(task.id)}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center">
              {currentPage === 1 ? null : (
                <Button
                  Toolbar
                  className="mt-3 mb-5 data float-left align"
                  onClick={() => paginate(currentPage - 1)}
                >
                  PreviousPage
                </Button>
              )}
              &nbsp;
              {tasks.length - currentPage * tasksPerPage <= 0 ? null : (
                <Button
                  Toolbar
                  className="mt-3 mb-5 data float-right align1"
                  onClick={() => paginate(currentPage + 1)}
                >
                  NextPage
                </Button>
              )}
            </div>
          </div>
        )}

        <Button
          variant="primary"
          className="mt-3 data mb-4"
          onClick={handleLogout}
        >
          <b>Log Out User</b>
        </Button>
      </Container>
      {/* Pagination Section */}
      {/* Add Task Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData1.title}
                onChange={handleInputChange1}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData1.description}
                onChange={handleInputChange1}
              />
            </Form.Group>
            <Form.Group controlId="formDueDate" className="mb-4">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData1.dueDate}
                onChange={handleInputChange1}
              />
            </Form.Group>
            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <br />
              <br />
              <Form.Check
                inline
                type="radio"
                label="Pending"
                name="status"
                value="Pending"
                checked={formData1.status === "Pending"}
                onChange={handleInputChange1}
              />
              <Form.Check
                inline
                type="radio"
                label="Completed"
                name="status"
                value="Completed"
                checked={formData1.status === "Completed"}
                onChange={handleInputChange1}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSubmit}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>View Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <div>
              <p>
                <strong>ID:</strong> {selectedTask.id}
              </p>
              <p>
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedTask.description}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedTask.dueDate}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  style={{
                    color: selectedTask.status === "Pending" ? "red" : "green",
                  }}
                >
                  {" "}
                  {selectedTask.status}
                </span>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <Form>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDueDate" className="mb-4">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <br />
                <br />
                <Form.Check
                  inline
                  type="radio"
                  label="Pending"
                  name="status"
                  value="Pending"
                  checked={formData.status === "Pending"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Completed"
                  name="status"
                  value="Completed"
                  checked={formData.status === "Completed"}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          {selectedTask && (
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TaskList;
