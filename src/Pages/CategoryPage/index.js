import TopNavbar from "../Navbar";
import {NavLink} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {LandingPageJson} from '../../Utils/Constants'
import {AppliedParentJson} from "../../redux/action";
import {useDispatch} from "react-redux";
import ErrorBoundary from "../../Components/ErrorBoundary";
import React, {useState} from "react";
import {LIVE_URL} from "../../env";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";

export default function CategoryPage() {
    let [loader, setLoader] = useState(false)
    const dispatch = useDispatch();
    localStorage.setItem("IsGenderFilterOpen" , 'False')
    const SetBasicJson = (ID) =>{
        dispatch(
            AppliedParentJson({
                data: {
                    CategoryID: [],
                    SubCategoryID: [ID],
                    Gender: [],
                    ProductType: [],
                    BrandType: [],
                    BrandID: [],

                    Color: [],
                    SiteColorID: [],

                    FADMonth: [],
                    FADYear: [],
                    InwardYear: [],
                    InwardMonth: [],
                    LiveStyle: [],
                    CondiFinalSourcing1: [],
                    CondiFinalSourcing2: [],
                    StockType: [],
                    Vendors: [],
                    Ageing: [],
                    MRP: [],
                    _30daysRPT: [],
                    _30DaysST: [],
                    _90daysRPT: [],
                    _90DaysST: [],
                    topbottom: [],
                    SellingPrice: [],
                    Replainshment: [],
                    B2BMixPercent: [],
                    IndMargin: [],
                    Discount: [],
                    NGM: [],
                    StockCover: [],
                    SRPercent: [],
                    TotalIntakeBucket: [],
                    AgeFrom: [],
                    TotalB2CSoldQty: [],
                    CTR: [],
                    Potypes: [],
                    PoAttributes: [],
                    sort: 'TotalRPT',
                    order: 'DESC',
                    page: 1,
                    pagesize: 100
                }
            })
        );
        localStorage.setItem("JsonData",JSON.stringify({
            CategoryID: [],
            SubCategoryID: [ID],
            Gender: [],
            ProductType: [],
            BrandType: [],
            BrandID: [],

            Color: [],
            SiteColorID: [],

            FADMonth: [],
            FADYear: [],
            InwardYear: [],
            InwardMonth: [],
            LiveStyle: [],
            CondiFinalSourcing1: [],
            CondiFinalSourcing2: [],
            StockType: [],
            Vendors: [],
            Ageing: [],
            MRP: [],
            _30daysRPT: [],
            _30DaysST: [],
            _90daysRPT: [],
            _90DaysST: [],
            topbottom: [],
            SellingPrice: [],
            Replainshment: [],
            B2BMixPercent: [],
            IndMargin: [],
            Discount: [],
            NGM: [],
            StockCover: [],
            SRPercent: [],
            TotalIntakeBucket: [],
            AgeFrom: [],
            TotalB2CSoldQty: [],
            CTR: [],
            Potypes: [],
            PoAttributes: [],
            sort: 'TotalRPT',
            order: 'DESC',
            page: 1,
            pagesize: 100
        }))
    }
    React.useEffect(() => {
        setLoader(true);
        let wishlistUrl = LIVE_URL + 'shortlistprodlistbyuser';
        var payload = {
            "userid": localStorage.getItem('userid'),
            "page": 1,
            "pagesize": 1000
        };
        axios.post(wishlistUrl, payload)
            .then((response) => {
                if (response.status === 200) { // Assuming response.status indicates success
                    setLoader(false);
                    const styles = response.data.data.map((item) => item.style);
                    localStorage.setItem("LikedProducts", styles)
                } else {
                    setLoader(false);
                }
            })
            .catch(() => {
                setLoader(false);
            });
    }, []);

    return (<>
        <Loader status={loader}/>
        <TopNavbar/>
        <ErrorBoundary>
            <div style={{textAlign: 'center', padding: '20px'}}>

                <span className='zoom' style={{
                    fontFamily: 'initial', fontSize: '50px'
                }}>Categories</span>

                {/*
                <img alt="logo" style={{width: '-webkit-fill-available'}} src={require('../../categories.png')}/>
*/}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <Container>
                    <Row>
                        {LandingPageJson.map((data => {
                            return (<Col className="p-2 d-flex flex-column justify-content-center align-content-center" style={{maxWidth: '200px'}} key={data.id}>
                                <NavLink className='d-flex flex-column' style={{all: 'unset'}} to="/categoryproductlisting" state={{CategoryId: data.SubCategoryID}} onClick={(e) =>{SetBasicJson(data.SubCategoryID)}}>
                                    <img  className='zoom' alt="logo" style={{height: '160px', width: '110px', cursor: 'pointer'}}
                                         src={data.SubImgName}/>
                                    <div
                                            variant="outline-secondary" className='my-button'><span
                                        className="text-dark Landing-Page-Class">{data.SubCategoryName}</span></div>{' '}
                                </NavLink>
                            </Col>)
                        }))}
                    </Row>
                </Container>
            </div>
        </ErrorBoundary>
      
    </>)
}