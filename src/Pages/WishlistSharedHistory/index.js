import './index.scss'
import Loader from "../../Components/Loader/Loader";
import React, {useState} from "react";
import ErrorBoundary from "../../Components/ErrorBoundary";
import TopNavbar from "../Navbar";
import {LIVE_URL} from "../../env";
import axios from "axios";
export default function WishlistSharedHistory(){
    let [loader, setLoader] = useState(false)
    let [SharedData, SetSharedData] = useState(false)
    React.useEffect(() => {
        setLoader(true);
        let wishlistUrl = LIVE_URL + 'getWhishlistProdHistory';
        var payload = {};
        axios.post(wishlistUrl, payload)
            .then((response) => {
                if (response.status) {
                    const data = response.data.data;

                    // Sort the data based on createddate in descending order
                    data.sort((a, b) => {
                        return new Date(b.createddate) - new Date(a.createddate);
                    });

                    SetSharedData(data);
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch(() => {
                setLoader(false);
            });
    }, []);
    const GetDownlode = (data) =>{
        setLoader(true);
        let wishlistUrl = LIVE_URL + 'genPresignedUrl';
        var payload = {
            id : data.id
        };
        axios.post(wishlistUrl, payload)
            .then((response) => {
                if (response.status) {
                    window.open(response.data.URL)
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch(() => {
                setLoader(false);
            });
    }

    return(
        <>
            <ErrorBoundary>
                <TopNavbar/>
                <Loader status={loader}/>
                <div className='d-flex flex-wrap justify-content-center'>
                    {SharedData.length ? <>
                        {SharedData.map((data) =>{
                            return(
                                <div>
                                    <div className='shared_class'>
                                        <div className='d-flex justify-content-between p-1'>
                                            <span>Shared With</span>
                                            <span style={{fontWeight: 'bold'}}>{data.createdby}</span>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <span>Created By</span>
                                            <span style={{fontWeight: 'bold'}}>{data.createdby}</span>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <span>Created Date</span>
                                            <span style={{fontWeight: 'bold'}}>{data.createddate}</span>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <span>Style Count</span>
                                            <span style={{fontWeight: 'bold'}}>{data.stylesCount}</span>
                                        </div>
                                        <div className='d-flex justify-content-end' style={{cursor: 'pointer'}} onClick={() =>{GetDownlode(data)}}>
                                            <i className="fa fa-cloud-download" style={{marginRight: '2%', color: 'green'}}></i>
                                            <span style={{color: 'green', fontSize: '12px',fontWeight: "bold"}}>Download</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </> : <></>}
                   
                </div>
            </ErrorBoundary>
           
        </>
    )
}