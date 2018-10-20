import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { Button } from "react-bootstrap";
import EN from "../../assets/img/us.svg";
import EL from "../../assets/img/gr.svg";

const ChangeLanguage = ({languages, activeLanguage, setActiveLanguage}) => {
    const getClass = (languageCode) => {
        return languageCode === activeLanguage.code ? 'active' : ''
    };

    return (
        <div>
            <Button bsSize="xsmall" onClick={() => setActiveLanguage("en")}><img src={EN} height="16"/></Button>
            <Button bsSize="xsmall" onClick={() => setActiveLanguage("el")}><img src={EL} height="16"/></Button>
        </div>
    );
};

export default withLocalize(ChangeLanguage);