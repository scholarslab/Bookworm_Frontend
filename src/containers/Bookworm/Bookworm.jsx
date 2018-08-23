import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
// import purple from 'material-ui/colors/purple';
import { loadOptions } from './BookwormActions';
// import * as d3 from 'd3';
// import json from './options.json';
// import lines from "./SharedToolTipData"
// import SharedToolTip from "./SharedToolTip"
// import D3MultiLineD3Graph from "./MultiLine"
import MultiLineD3Graph from './D3MultiLine';
// console.log(compose);
const theme = createMuiTheme({
    palette: {
        primary: { main: '#b3e5fc', }, // Purple and green play nicely together.
        secondary: { main: '#e1bee7', }, // This is just green.A700 as hex.
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 200,
    },
});

export class Bookworm extends React.Component {
    constructor(props) {
        super(props);
    }    
    render() {
        return (
            <MuiThemeProvider theme={theme} >
                <MultiLineD3Graph />
            </MuiThemeProvider>
        );
    }
}

Bookworm.propTypes = {
    options: PropTypes.object,
    loadOptions: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { bookwormReducer } = state;
    const {
        options,
    } = bookwormReducer;

    return {
        options,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadOptions: (json) => {
            dispatch(loadOptions(json));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Bookworm);