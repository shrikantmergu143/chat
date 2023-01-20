import React from "react";
import { Form, Image } from 'react-bootstrap';
import Search from '../../assets/img/sidebar/search.svg';
import SearchClose from "../../assets/img/cancel_search.png";

const SearchBox = (props) => {
    const { filterMembers,setFilterMembers } = props;

    return(
        <div className="chatSearchBox">
            <Image src={Search} alt="search" />
            <Form.Control
                value={filterMembers}
                onChange={(e) => setFilterMembers(e.target.value)}
                placeholder="Search…"
                aria-label="Username"
                aria-describedby="basic-addon1"
            />
            {filterMembers !== "" && (<Image src={SearchClose} className="searchCancel" onClick={() => setFilterMembers("")} alt="search close" />)}
        </div>
    )
}

export default SearchBox;