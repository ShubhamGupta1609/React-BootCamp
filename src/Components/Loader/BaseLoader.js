import "./Loader.scss"
import Spinner from "react-bootstrap/Spinner";
export default function BaseLoader(status){
    return(
        <>
            {
                status.status === true ? <div className="">
                    <div className='d-flex flex-column'>
                        <Spinner animation="border" variant="primary" style={{marginLeft: '30%'}}/>
                        <h2>Loading...</h2>
                    </div>
                </div>: <></>
            }

        </>
    )
}