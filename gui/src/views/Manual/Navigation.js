import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from "react-localize-redux";

export const CustomPrevButton = (props) => {
    const {
        page,
        pages,
        handlePrevClick
    } = props;
    if (page === 1) return <div></div>;

    return <h5 style={{cursor: 'pointer', display: 'inline-block', marginRight: 50, marginTop: 0}} onClick={handlePrevClick}><Translate id="general.previousPage"/></h5>;
};
CustomPrevButton.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    handlePrevClick: PropTypes.func.isRequired
};

export const CustomNextButton = (props) => {
    const {
        page,
        pages,
        handleNextClick
    } = props;
    if (page === pages) return <div></div>;

    return <h5 style={{cursor: 'pointer', display: 'inline-block', marginLeft: 50, marginTop: 0}} onClick={handleNextClick}><Translate id="general.nextPage"/></h5>;
};
CustomNextButton.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    handleNextClick: PropTypes.func.isRequired
};

export const CustomPages = (props) => {
    const {
        page,
        pages
    } = props;
    return <h5 style={{display: 'inline-block', marginTop: 0}}><Translate id="general.page"/> {page} <Translate id="general.from"/> {pages}</h5>;
};
CustomPages.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired
};

const CustomNavigation = (props) => {
    const {
        page,
        pages
    } = props;

    const {
        handlePrevClick,
        handleNextClick
    } = props;

    return (<div className="customWrapper">
        <CustomPrevButton page={page} pages={pages} handlePrevClick={handlePrevClick} />
        <CustomPages page={page} pages={pages} />
        <CustomNextButton page={page} pages={pages} handleNextClick={handleNextClick} />
    </div>);
};
CustomNavigation.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    handlePrevClick: PropTypes.func.isRequired,
    handleNextClick: PropTypes.func.isRequired
};

export default CustomNavigation;