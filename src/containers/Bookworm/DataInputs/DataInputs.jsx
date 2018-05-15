import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import FilterList from '@material-ui/icons/FilterList';

export class DataInputs extends React.Component {
    constructor(props) {
        super(props);
        state = {
            defaultSearchDialog: {
                open: false
            }
        };
    }
    renderDefaultInputs() {
        const {options} = this.props;
        return (
            <div>
                <TextField
                    label="Dense"
                    id="margin-dense"
                    defaultValue={options['default_search'][0]['search_limits'][0]['word'][0]}
                    className={classes.textField}
                    helperText="Some important text"
                    margin="dense"
                />
                <Button className={classes.button} variant="raised" color="secondary">
                    <FilterList className={classes.rightIcon} />
                </Button>
            </div>
        )
    }


    render() {
        const { classes } = props;
        return (
            <div>
                
            </div>
        );
    }
}

DataInputs.propTypes = {
    classes: PropTypes.object,
    options: PropTypes.object,
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
export default connect(mapStateToProps, mapDispatchToProps)(DataInputs);