import {Navigate, Route, useNavigate} from 'react-router-dom';

 function Protected({component: Component, ...rest}){
    let navigate = useNavigate();
    let token = localStorage.getItem("token")
   
  return (
      <Route
          {...rest} 
          render={(props) =>
      <Component {...props}/>
          }
      />
  )
}
export default Protected