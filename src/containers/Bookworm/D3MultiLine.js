import React from 'react';
import * as d3 from 'd3';
// import * as d3Drag from 'd3-drag';
// import * as d3Force from 'd3-force';
// import * as d3Scale from 'd3-scale';
// import * as d3Selection from 'd3-selection';
import PropTypes from 'prop-types';
// http://blockbuilder.org/ZoeLeBlanc/f1b85363fdbe9357a7d7ae5f261b8e79
// https://bl.ocks.org/ZoeLeBlanc/00a2cfcc2d7818e5afcf678037afbbc3
// https://bl.ocks.org/ZoeLeBlanc/ac87b65e609d7a3ca03c290ee7e7aaa4
class MultiLineD3Graph extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { height, width, margin, margin2 } = this.props;
        this.height2 = height - margin2.top - margin2.bottom;
        this.height = height - margin.top - margin.bottom;
        this.width = width - margin.left
        this.x_scale = d3.scaleTime().range([0, this.width]);
        this.x2_scale = d3.scaleTime().range([0, this.width]);
        this.y_scale = d3.scaleLinear().range([this.height, 0]);
        this.y2_scale = d3.scaleLinear().range([this.height2, 0]);
        this.xAxis = d3.axisBottom(this.x_scale);
        this.xAxis2 = d3.axisBottom(this.x2_scale);
        this.yAxis = d3.axisBottom(this.y_scale);
        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on("brush end", brushed);
        this.zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", zoomed);
        this.z = d3.scaleOrdinal(d3.schemeCategory10);
    }
    buildAxes(){
        const focus = d3.selectAll('.focus');
        focus.append('g')
            .attr("class", "axis-x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        focus.append('g')
            .attr("class", "axis-y")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);
        
    }
    render() {
        const {width, height, margin, margin2} = this.props;
        return (
            <svg width={width} height={height}>
                <g className="focus" translate={`transform(${margin.left}, ${margin.top})`} />
                <g className="context" translate={`transform(${margin2.left}, ${margin2.top})`}/>
            </svg>
        );
    }
}

MultiLineD3Graph.defaultProps = {
    width: 1500,
    height: 700,
    margin: { top: 20, right: 30, bottom: 110, left: 40 },
    margin2: { top: 430, right: 20, bottom: 30, left: 40 },
};

MultiLineD3Graph.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.object,
    margin2: Proptypes.object,
};

export default MultiLineD3Graph;