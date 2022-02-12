import React, { useState, useEffect } from "react";
import { Spin, Card, Button } from "antd";
import { Layout } from "antd";
import api from "../api/api";

const { Header, Content } = Layout;

export default function UsersTasks() {
  const [loading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    const token = JSON.parse(sessionStorage.getItem("token"));

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await api.get("/tasks", requestOptions);
      if (res.data) {
        setIsLoading(false);
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  //
  const renderTasks = (tasks) => {
    let nonCompletedTasks = "";
    if (tasks) {
      const renderedResults = tasks.map((task) => {
        if (!task.isCompleted) {
          nonCompletedTasks = (
            <Card className="task-card" key={task._id}>
              <p> description:{task.description}</p>
              <p> category:{task.category}</p>
              <p> importance:{task.importance}</p>
              <p> urgency:{task.urgency}</p>
              <p> willingness:{task.willingness}</p>
              <p> task created at:{task.createdAt.slice(0, -14)}</p>
              <p> task due at :{task.dueDate.slice(0, -14)}</p>

              <Button
                className="button complete-task-btn"
                onClick={() => {
                  completeTask(task._id);
                }}
              >
                completed
              </Button>
              <Button
                className="button delete-task-btn"
                onClick={() => {
                  deleteTask(task._id);
                }}
              >
                delete task
              </Button>
            </Card>
          );
        }
        return nonCompletedTasks;
      });
      return renderedResults;
    }
  };

  const sortByUrgancyFunc = () => {
    let tasksArray = [...tasks];
    tasksArray.sort(function (a, b) {
      return parseFloat(b.urgency) - parseFloat(a.urgency);
    });
    setTasks([...tasksArray]); //for re render
  };

  const sortByWillingnessFunc = () => {
    let tasksArray = [...tasks];
    tasksArray.sort(function (a, b) {
      return parseFloat(b.willingness) - parseFloat(a.willingness);
      //return new Date(b.willingness) - new Date(a.date);
    });
    setTasks([...tasksArray]); //for re render
  };

  const sortByImportanceFunc = () => {
    let tasksArray = [...tasks];
    tasksArray.sort(function (a, b) {
      return parseFloat(b.importance) - parseFloat(a.importance);
    });
    setTasks([...tasksArray]); //for re render
  };

  const sortByDueDateFunc = () => {
    let tasksArray = [...tasks];
    //
    tasksArray.sort(function (a, b) {
      return new Date(b.dueDate) - new Date(a.dueDate);
    });

    setTasks([...tasksArray]); //for re render
  };

  const sortByProcrastinationFunc = () => {
    let tasksArray = [...tasks];
    //procratination time..
    setTasks([...tasksArray]); //for re render
  };

  useEffect(() => {
    getTasks();
  }, []);

  const deleteTask = async (taskId) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    let myTasks = tasks;
    if (myTasks) {
      try {
        await api.delete(`/tasks/${taskId}`, requestOptions);
      } catch (error) {
        console.log(error);
      }
      const task = tasks.find((elm) => (elm._id = taskId));
      const index = myTasks.indexOf(task);
      if (index > -1) {
        myTasks.splice(index, 1);
      }
      //creates new array to force re-render
      setTasks([...myTasks]);
    }
  };
  const completeTask = async (taskId) => {
    const token = JSON.parse(sessionStorage.getItem("token"));

    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    let myTasks = tasks;
    //if (myTasks) {
    const task = tasks.find((elm) => (elm._id = taskId));
    const index = myTasks.indexOf(task);
    if (index > -1) {
      task.isCompleted = true;
      try {
        console.log(task);
        await api.patch(
          `/tasks/${taskId}`,
          JSON.stringify(task),
          requestOptions
        );
      } catch (error) {
        console.log(error);
      }
    }
    setTasks([...myTasks]);
    // }
  };
  return (
    <div className="spinner-container">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Layout>
          <Header className="users-tasks-header">
            <Button
              type="secondary"
              className="button "
              onClick={() => sortByDueDateFunc()}
            >
              Display by due date{" "}
            </Button>
            <Button
              type="secondary"
              className="button "
              onClick={() => sortByUrgancyFunc()}
            >
              Display by urgency{" "}
            </Button>
            <Button
              type="secondary"
              className="button "
              onClick={() => sortByImportanceFunc()}
            >
              Display by importance{" "}
            </Button>
            <Button
              type="secondary"
              className="button "
              onClick={() => sortByWillingnessFunc()}
            >
              Display by willingness{" "}
            </Button>
            <Button
              type="secondary"
              className="button "
              onClick={() => sortByProcrastinationFunc()}
            >
              Display by procrastination time{" "}
            </Button>
          </Header>
          <Content>
            <div>
              <div>tasks:</div> {renderTasks(tasks)}
            </div>
          </Content>
        </Layout>
      )}
    </div>
  );
}
