{/* NOTE : UI SIDEBAR FOR DESKTOP*/}
{/*   <div className='GenderPopUpHeader d-flex justify-content-between'
                             style={{position: 'sticky', top: '0px'}}>
                            <span>Filters</span>
                            <span onClick={ClearAllFiltersFunction}>CLEAR ALL</span>
                        </div>
                        <div className=''>
                            <Tab.Container id="left-tabs-example" defaultActiveKey={4}>
                                <Row style={{background: 'white'}}>
                                    <Col style={{paddingRight: '0px'}}>


                                        <Nav variant="pills" className="FilterCol-1">

                                            Main Section For Filter Division

                                            {StaticMainFilterData.map((data => {
                                                return (
                                                    <div key={data.id}>
                                                        <Nav.Item>
                                                            {data.keyID !== null ? <Nav.Link onClick={(e) => {
                                                                    GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                                                }} eventKey={data.id}>{data.name} <strong style={{
                                                                    float: 'right',
                                                                    fontWeight: '100'
                                                                }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                                                : <Nav.Link onClick={(e) => {
                                                                    GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                                                }} eventKey={data.id}>{data.name} <strong style={{
                                                                    float: 'right',
                                                                    fontWeight: '100'
                                                                }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                                            }
                                                        </Nav.Item>
                                                    </div>
                                                )
                                            }))}

                                            {DistinctValueArr !== [] ? <>
                                                {DistinctValueArr.map((data => {
                                                    return (
                                                        <div key={data.id}>
                                                            <Nav.Item>
                                                                <Nav.Link onClick={(e) => {
                                                                    GetDynamicFilterStaticValueDataForDistinctTypes(data.key, data)
                                                                }} eventKey={data.id}><span
                                                                    style={{color: 'blue'}}>{data.key} <strong style={{
                                                                    float: 'right',
                                                                    fontWeight: '100'
                                                                }}>{findLengthOfType(data.key)}</strong></span></Nav.Link>
                                                            </Nav.Item>
                                                        </div>
                                                    )
                                                }))}
                                            </> : <></>}

                                                PO Attributes Code
                                            <nav className="animated bounceInDown">
                                                <ul>
                                                    <li className="sub-menu">
                                                        <a onClick={handleSubMenuToggle}>
                                                            PO Attributes
                                                            <div
                                                                className={`fa ${isSubMenuOpen ? "fa-caret-up" : "fa-caret-down"} right`}></div>
                                                        </a>
                                                        {isSubMenuOpen && (
                                                            <ul>
                                                                {POAttributesArr.map((data) => (
                                                                    <li key={data.key}>
                                                                        <a onClick={(e) => {
                                                                            GetDynamicFilterStaticValueDataForDistinctTypesPO(data.key, data)
                                                                        }}>{data.key} <strong style={{
                                                                            float: 'right',
                                                                            fontWeight: '100'
                                                                        }}>{findLengthOfPoAttributes(data.key)}</strong></a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                </ul>
                                            </nav>
                                             PO Attributes Code

                                            {StaticMainFilterData1.map((data => {
                                                return (
                                                    <div key={data.id}>
                                                        <Nav.Item>
                                                            {data.isRange ? <Nav.Link onClick={(e) => {
                                                                    GetDynamicFilterStaticValueDataRange(data.keyID)
                                                                }} eventKey={data.id}>{data.name} <strong style={{
                                                                    float: 'right',
                                                                    fontWeight: '100'
                                                                }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                                                : <Nav.Link onClick={(e) => {
                                                                    GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                                                }} eventKey={data.id}>{data.name} <strong style={{
                                                                    float: 'right',
                                                                    fontWeight: '100'
                                                                }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                                            }
                                                        </Nav.Item>
                                                    </div>
                                                )
                                            }))}

                                            Main Section For Filter Division
                                        </Nav>
                                    </Col>


                                    <Col style={{paddingLeft: '0px'}}>
                                        <div style={{overflow: "scroll", height: '89vh'}}>
                                            {TriggerDistinctType ? <>
                                                {StaticFilterRes.map(((data, index) => {
                                                    return (
                                                        <div key={data.id}>
                                                            {TriggerDistinctTypePO ? <div>
                                                                <div
                                                                    className='listGeResOnCLick d-flex justify-content-between'>
                                                                    <div className='d-flex align-content-center'>
                                                                        <input
                                                                            type="checkbox"
                                                                            style={{marginRight: "10px"}}
                                                                            name={`${DynamicFilterStaticValueDataDistinctTypePO}_${data.key}`} // update name attribute
                                                                            id={`${DynamicFilterStaticValueDataDistinctTypePO}_${index}`}
                                                                            value={data.key}
                                                                            checked={
                                                                                filter.PoAttributes.some(
                                                                                    (attr) =>
                                                                                        attr[DynamicFilterStaticValueDataDistinctTypePO] &&
                                                                                        attr[DynamicFilterStaticValueDataDistinctTypePO].includes(data.key) // updated checked logic
                                                                                )
                                                                            }
                                                                            onChange={(e) => {
                                                                                handleCheckboxChangeDistinctType(e, "DistinctPO", "Desktop");
                                                                            }}
                                                                        />
                                                                        <span>{data.key}</span>
                                                                    </div>
                                                                    <span>{data.doc_count}</span>
                                                                </div>
                                                            </div> : <div key={data.id}>
                                                                <div
                                                                    className='listGeResOnCLick d-flex justify-content-between'>
                                                                    <div className='d-flex align-content-center'>
                                                                        <input type="checkbox"
                                                                               style={{marginRight: '10px'}}
                                                                               name={DynamicFilterStaticValueDataDistinctType}
                                                                               id={`${DynamicFilterStaticValueDataDistinctType}_${index}`}
                                                                               value={data.key}
                                                                               checked={
                                                                                   filter.Potypes.some(
                                                                                       (potype) => potype.type === DynamicFilterStaticValueDataDistinctType && potype.value.includes(data.key)
                                                                                   )
                                                                               }
                                                                               onChange={(e) => {
                                                                                   handleCheckboxChangeDistinctType(e, 'Distinct', 'Desktop')
                                                                               }}
                                                                        />
                                                                        <span>{data.key}</span>
                                                                    </div>
                                                                    <span>{data.doc_count}</span>
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    )
                                                }))}
                                            </> : <div>
                                                {StaticFilterRes.map(((data, index) => {
                                                    return (
                                                        <div key={data.id}>
                                                            <div
                                                                className='listGeResOnCLick d-flex justify-content-between'>
                                                                <div className='d-flex align-content-center'>
                                                                    {DynamicFilterStaticValueData === null ?
                                                                        <div>
                                                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ? <>
                                                                                    <input type="checkbox"
                                                                                           style={{marginRight: '10px'}}
                                                                                           name={DynamicFilterStaticValueData1}
                                                                                           id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                                           value={Object.values(data)[0]}
                                                                                           checked={filter[DynamicFilterStaticValueData1].includes(Object.values(data)[1])}
                                                                                           onChange={(e) => {
                                                                                               handleCheckboxChange(e, data, 'Desktop')
                                                                                           }}
                                                                                    />
                                                                                </> :
                                                                                <>
                                                                                    <input type="checkbox"
                                                                                           style={{marginRight: '10px'}}
                                                                                           name={DynamicFilterStaticValueData1}
                                                                                           id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                                           value={Object.values(data)[0]}
                                                                                           checked={GetCatFilterChecked(Object.values(data)[0], 'BaseKeys')}
                                                                                           onChange={(e) => {
                                                                                               handleCheckboxChange(e, data, 'Desktop')
                                                                                           }}
                                                                                    />
                                                                                </>}
                                                                        </div> :
                                                                        <div>
                                                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ?
                                                                                <>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        style={{marginRight: "10px"}}
                                                                                        name={DynamicFilterStaticValueData}
                                                                                        id={`${DynamicFilterStaticValueData}_${index}`}
                                                                                        value={Object.values(data)[0]}
                                                                                        checked={GetCatFilterChecked(Object.values(data)[0], 'CatKeys')}
                                                                                        onChange={(e) => {
                                                                                            handleCheckboxChange(e, data, 'Desktop');
                                                                                        }}
                                                                                    />
                                                                                </> :

                                                                                <>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        style={{marginRight: "10px"}}
                                                                                        name={DynamicFilterStaticValueData}
                                                                                        id={`${DynamicFilterStaticValueData}_${index}`}
                                                                                        value={Object.values(data)[1]}
                                                                                        checked={
                                                                                            filter[DynamicFilterStaticValueData].some((val) =>
                                                                                                val.hasOwnProperty("from") && val.hasOwnProperty("to")
                                                                                                    ? `${val.from}-${val.to}` === data.range
                                                                                                    : val === Object.values(data)[1]
                                                                                            )
                                                                                        }
                                                                                        onChange={(e) => {
                                                                                            handleCheckboxChange(e, data, 'Desktop');
                                                                                        }}
                                                                                    />
                                                                                </>}
                                                                        </div>
                                                                    }
                                                                    {PriceRangeFilter !== '' ?
                                                                        <span>{data.range}</span> :
                                                                        <span>{data[DynamicFilterStaticValueData1]}</span>}
                                                                </div>
                                                                <span>{data['doc_count']}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }))}
                                            </div>}
                                        </div>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
*/}
{/* NOTE : UI SIDEBAR FOR DESKTOP*/}