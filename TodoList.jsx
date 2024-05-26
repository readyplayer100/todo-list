import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

  const TaskList = (props) => {
    // 使用从父组件接收的函数更新内容
    const onClickDelete = (index) => {
        props.onClickDelete(index);
    };
    
    const onClickSwitch = (index) => {
        props.onClickSwitch(index);
    };

    return (
        <tbody id="todo-body">  
        {props.filteredTodoList.map((todo, index) => (
          <tr key={'task' + index}>
            <td>{index + 1}</td>
            {todo.status === "FINISHED"  &&  
               <><td><div className='finished_only'>{todo.comment}</div></td>
               <td><div className='finished_only'>{todo.ddl}</div></td></>
            }
            {todo.status === "IN PROCESS" && todo.ddl < props.today_value &&  
               <><td><div className='delay_only'>{todo.comment}</div></td>
               <td><div className='delay_only'>{todo.ddl}</div></td></>
            }
            {todo.status === "IN PROCESS" && todo.ddl >= props.today_value &&  
               <><td><div className='in_process'>{todo.comment}</div></td>
               <td><div className='in_process'>{todo.ddl}</div></td></>
            }
            <td><Button type="primary"  value={index}   onClick={(event) => onClickSwitch(index)} >{todo.status}</Button></td>
            <td><Button type="danger"   icon={<DeleteOutlined />}  onClick={(event) => onClickDelete(index)} ></Button></td>
          </tr>
        ))}
        </tbody>

    );
  }
  export default TaskList;