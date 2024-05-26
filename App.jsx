import './App.css';
import React, { useEffect, useState } from "react";
import { Input,Button, Radio, message} from 'antd';

import TaskList from "./components/TodoList.jsx";
import { UploadOutlined,DownloadOutlined } from '@ant-design/icons';

export const App = () => {
  // todolist
  //设置ddl初始日期为当日
  var today = new Date();
  today.setDate(today.getDate()); //取得当天的日期
  var yyyy = today.getFullYear();
  var mm = ("0"+(today.getMonth()+1)).slice(-2);
  var dd = ("0"+today.getDate()).slice(-2);
  var today_value =yyyy+'-'+mm+'-'+dd;

  const [todoText, setTodoText] = useState("");
  const [time,setDeadLine] =useState(today_value);
  const [todoList, setNewTodoList] = React.useState([{ comment: 'Task001', ddl: '2024-04-30', status: 'IN PROCESS' }]);
  const [filteredTodoList, setFilteredTodoList] = React.useState([]);
  const [radio, setRadio] = React.useState('all');

  useEffect(() => {
     // 更新DOM
     selectedTodoSet(radio);
  }, [todoList,radio]);

   // 单选按钮更新
  const handleChange = (event) => {
    setRadio(event.target.value);
    //console.log("value=",event.target.value);
    //console.log("radio=",radio);
    //selectedTodoSet(event.target.value);
    return
    }

  const selectedTodoSet = (selRadio) => {
    //将全部设置为默认值
   
    //处理进行中和已完成
    if (selRadio === "incomplete") {
      const incompleteTodoList = [...todoList].filter((todo) => todo.status === "IN PROCESS");
      setFilteredTodoList(incompleteTodoList);
    } else if (selRadio === "complete") {
      const completeTodoList = [...todoList].filter((todo) => todo.status === "FINISHED");
      setFilteredTodoList(completeTodoList);
    } else  {
      const allTodoList = [...todoList];
      setFilteredTodoList(allTodoList);
    } 
    //console.log("fff1=",filteredTodoList.length);
    //console.log("aaa1=",todoList.length);
  }

  // 管理输入表单状态
  const onChangeTodoText = (event) => {
    //alert("text");
    setTodoText(event.target.value);
  };
  const onChangeDeadLine = (event) => {
    //alert("time");
    setDeadLine(event.target.value);
  };

  // 按下提交按钮，将任务添加到待办事项列表中。
  const onClickAdd = () => {
    if (todoText === "") {
      message.error("PLEASE INPUT YOUR TASK AND ITS END DATE.");
      return;
    }

    const newTodo = {
      comment: todoText,
      ddl: time,
      status: "IN PROCESS"
    }
    // 更新DOM
    todoList.push(newTodo);
    // 将输入形式设置为“”
    setTodoText("");
    selectedTodoSet(radio);


    };

  // 削除
  const onClickDelete = (index) => {
    const selComment = filteredTodoList[index].comment;
    setNewTodoList(
        todoList.filter((todo) => (todo.comment !== selComment))
    );
    setFilteredTodoList(
        filteredTodoList.filter((todo) => (todo.comment !== selComment))
    );
  
};

  // 切换状态
  const onClickSwitch = (index) => {
    const selComment = filteredTodoList[index].comment;
    const switchTodoList = todoList.map((todo, index) => {
      if (todo.comment === selComment && todo.status === "IN PROCESS"){
        return {...todo, status:'FINISHED'};
      }
      if (todo.comment === selComment && todo.status === "FINISHED"){
        return {...todo, status:'IN PROCESS'};
      }
      return todo;
    });
    setNewTodoList(switchTodoList);
   

    const newFilteredTodoList = [...filteredTodoList];
    if (newFilteredTodoList[index].status === "IN PROCESS") {
      newFilteredTodoList[index].status = "FINISHED";
    } else if (newFilteredTodoList[index].status === "FINISHED") {
      newFilteredTodoList[index].status = "IN PROCESS";
    }
    setFilteredTodoList(newFilteredTodoList);
  };

  // export
  const onClickExport = () => {
    const exportTodoList = [...todoList];
    const fileName = 'todo';
    const fileNameWithJson = `${fileName}.json`;
    const blobData = new Blob([JSON.stringify(exportTodoList)], {type: 'text/json',});
    const jsonURL = URL.createObjectURL(blobData);

    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute('download', fileNameWithJson);
    link.click();
    document.body.removeChild(link);
  };
  // import
  const onClickImport = () => {
   const fileInput = document.createElement("input");
   fileInput.type = "file";
   fileInput.click();

   //const fileInputRef = useRef(fileInput);

   const handleFileReader = async (e) => {
    //setIsReading(true);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log(e.target.result);
        try {
          const importTodoList = JSON.parse(e.target.result);
          setNewTodoList(importTodoList);
          message.info("任务已加载。");
        }catch(err){
          message.error("您指定的文件不是 JSON 文件。");
        }
      };
      reader.readAsText(file);
      } catch (error) {
        message.error("加载任务时发生错误。");
      } finally {

      }
   };

   fileInput.onchange = handleFileReader;

  };

  return (
    <>
      <h1>ToDo List</h1>
      <div className="complete-area">
        <Radio  value="all" onChange={handleChange} checked={radio === 'all'}>ALL</Radio>
        <Radio  value="incomplete" onChange={handleChange} checked={radio === 'incomplete'}>IN PROCESS</Radio>
        <Radio  value="complete" onChange={handleChange} checked={radio === 'complete'}>FINISHED</Radio>

        <table className="todoTable">
          <thead>
            <tr>
              <td className="seq">ID </td>
              <td className="comment">MY PROJECTS</td>
              <td className="ddl">DDL</td>
              <td className="status">STATUS</td>
              <td className="delete">REMOVE</td>
            </tr>
          </thead>
             <TaskList onClickDelete={onClickDelete} 
                       onClickSwitch={onClickSwitch}
                       filteredTodoList={filteredTodoList}
                       today_value={today_value} />
        </table>
      </div>

      <h2>ADD TASK</h2>
      <div className="add-todo">
      <Input size="large" className="newTask"
          placeholder="PLEASE INPUT YOUR TASK HERE!"
          value={todoText}
          onChange={onChangeTodoText}
        />
      </div>
      <h2>CHOOSE YOUR DEADLINE</h2>
      <label htmlFor="end">End date:</label>
      <input type="date" id="end" name="work ddl" onChange={onChangeDeadLine} defaultValue={time} />
      <div className='space1' />
      <Button type="primary"    onClick={(event) => onClickAdd()} >SUBMIT</Button>
      <div className='space2' />
      <Button type="primary" shape="round"  icon={<UploadOutlined />} onClick={(event) => onClickImport()}> Import TodoList </Button>
      <div className='space1' />
      <Button type="primary" shape="round"  icon={<DownloadOutlined />} onClick={(event) => onClickExport()}> Export TodoList </Button>
    </>

  );
}

export default App;