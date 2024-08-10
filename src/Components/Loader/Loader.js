import "./Loader.scss"
import Spinner from "react-bootstrap/Spinner";
export default function Loader(status){
    return(
        <>
            {
                status.status === true ? <div className="square-wrap">
                    <div className='d-flex flex-column center'>
                        <Spinner animation="border" variant="primary" style={{marginLeft: '30%'}}/>
                        <h2>Loading...</h2>
                    </div>
                </div>: <></>
            }

        </>
    )
}