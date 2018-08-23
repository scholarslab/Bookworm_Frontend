import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class Navbar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography className={classes.flex} type="title" color="inherit">
                        <Button href="/">Bookworm 📚🐛 </Button>
                    </Typography>
                    <Button color="inherit" href="/about">About ℹ️</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(Navbar);
