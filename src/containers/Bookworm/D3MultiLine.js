import React from 'react';
import * as d3 from 'd3';
// import * as d3Drag from 'd3-drag';
// import * as d3Force from 'd3-force';
// import * as d3Scale from 'd3-scale';
// import * as d3Selection from 'd3-selection';
import PropTypes from 'prop-types';
import '../../assets/app.css';
// http://blockbuilder.org/ZoeLeBlanc/f1b85363fdbe9357a7d7ae5f261b8e79
// https://bl.ocks.org/ZoeLeBlanc/00a2cfcc2d7818e5afcf678037afbbc3
// https://bl.ocks.org/ZoeLeBlanc/ac87b65e609d7a3ca03c290ee7e7aaa4
//http://blockbuilder.org/ZoeLeBlanc/0c817e6f998c45ca6a97568c79c235c6

   
class MultiLineD3Graph extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { height, width, margin } = this.props;
        this.height = height - margin.top - margin.bottom;
        this.width = width - margin.left - margin.right;
        this.g = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.x_scale = d3.scaleTime().range([0, this.width]);
        this.y_scale = d3.scaleLinear().range([this.height, 0]);
        this.z_scale = d3.scaleOrdinal(d3.schemeCategory10);
        this.processData();
        
    }

    processData(){
        const parseTime = d3.timeParse("%Y");
        const {searchLimits, data} = this.props;
        this.lines = searchLimits.map( (limit, i) => {
            let obj = {
                'word': limit.word[0],
                'values': null,
            }
            obj.values = Object.entries(data[i]).map( (d) => {
                return {
                    'year': parseTime(d[0]),
                    'value': d[1][0],
                    'data': obj,
                }
            });
            console.log(obj.values);
            return obj
        });
        this.extentLines = this.lines.reduce( (arr, elem) => arr.concat(elem.values), []);
        this.x_scale.domain(d3.extent(this.extentLines, (d) => { return d.year }));
        this.y_scale.domain([
            d3.min(this.lines, (c) => { return d3.min(c.values, (d) => { return d.value }); }),
            d3.max(this.lines, (c) => { return d3.max(c.values, (d) => { return d.value }); })
        ]).nice();
        this.z_scale.domain(this.lines.map((c) => { return c.word }));
        
        this.buildAxes();
    }
    

    
    buildAxes(){
        const lineGraph = d3.selectAll('.lineGraph');
        
        lineGraph.append('g')
            .attr("class", "axis-y")
            .call(d3.axisLeft(this.y_scale).ticks(10))
            .append("text")
            .attr("x", 4)
            .attr("y", 0.5)
            .attr("dy", "0.32em")
            .style("text-anchor", "start")
            .style("fill", "#000")
            .style("font-weight", "bold")
            .text("Frequencies");
        
        lineGraph.append('g')
            .attr("class", "axis-x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x_scale).ticks(10).tickFormat(d3.timeFormat("%Y")));
        
        this.addLines();
        
    }
    addLines(){
        const { height, width, margin } = this.props;
        const line =  d3.line()
                .x(d => this.x_scale(d.year))
                .y(d => this.y_scale(d.value));
        const lineGraph = d3.selectAll('.lineGraph').append("g")
            .attr("class", "lines")
            .selectAll("path")
            .data(this.lines)
            .enter().append("path")
            .attr("d", (d) => { return line(d.values); })
            .attr("id", (d) => { return d.word; })
            .attr("class", "line-path")
            .style("stroke", (d) => { d.line = document.getElementById(`${d.word}`); return this.z_scale(d.word); });

        console.log(this.lines)
        
        const focus = d3.selectAll('.lineGraph').append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("circle")
            .attr("r", 3.5);

        focus.append("text")
            .attr("y", -10);
        const voronoiGroup = d3.selectAll('.lineGraph').append("g")
            .attr("class", "voronoi");
        const voronoi = d3.voronoi()
            .x((d) => { return this.x_scale(d.year) })
            .y((d) => { return this.y_scale(d.value) })
            .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
        

        console.log(voronoiGroup.selectAll("path"))
        const mouseover = (d) =>{
            console.log(d)
            const focus = d3.selectAll('.focus');
            console.log(d3.select(d.data.data.line));
            d3.select(d.data.data.line).classed("line--hover", true);
            d.data.data.line.parentNode.appendChild(d.data.data.line);
            focus.attr("transform", "translate(" + this.x_scale(d.data.year) + "," + this.y_scale(d.data.value) + ")");
            let word = d.data.data.word + ' ' + d.data.value
            focus.select("text").text(word);
        }
        const mouseout = (d) => {
            const focus = d3.selectAll('.focus');
            d3.select(d.data.data.line).classed("line--hover", false);
            focus.attr("transform", "translate(-100,-100)");
        }
        voronoiGroup.selectAll("path")
            .data(voronoi.polygons(d3.merge(this.lines.map((d) => { return d.values; }))))
            .enter().append("path")
                .attr("d", (d) => { return d ? "M" + d.join("L") + "Z" : null; })
                .on("mouseover", (d) => { return mouseover(d)})
                .on("mouseout", (d) => mouseout(d));

    }
    
    render() {
        const {width, height, margin} = this.props;
        return (
            <svg width={width+margin.left+margin.right} height={height+margin.top+margin.bottom}>
                <g className="lineGraph" transform={`translate(${margin.left}, ${margin.top})`} />
            </svg>
        );
    }
}

MultiLineD3Graph.defaultProps = {
    width: 1500,
    height: 700,
    margin: { top: 20, right: 30, bottom: 110, left: 40 },
    data: [{ "1750": [2.5721930258], "1751": [3.4802691509], "1752": [34.0486790722], "1753": [4.2230735705], "1754": [30.6770945779], "1755": [7.0708448861], "1756": [22.0697088656], "1757": [7.3031384672], "1758": [46.9935334552], "1759": [4.920250088], "1760": [7.8229615633], "1761": [3.5732889834], "1762": [5.6262449094], "1763": [7.4298914534], "1764": [3.1350838933], "1765": [8.059549693], "1766": [5.55455177], "1767": [6.3485151959], "1768": [9.6600582058], "1769": [10.4210353163], "1770": [9.6256143999], "1771": [9.4961617779], "1772": [5.500657717], "1773": [4.7009675781], "1774": [15.965908021], "1775": [12.6796309004], "1776": [9.2911263147], "1777": [8.1982093892], "1778": [8.9130761358], "1779": [13.5557600453], "1780": [27.1723705232], "1781": [7.6105935572], "1782": [13.6451368526], "1783": [7.7577128188], "1784": [11.8934236486], "1785": [8.0997307801], "1786": [6.8955274669], "1787": [6.4245270959], "1788": [15.2584314163], "1789": [19.1908241745], "1790": [9.4570541725], "1791": [11.3153731663], "1792": [16.905482534], "1793": [13.9588097989], "1794": [19.9730125659], "1795": [18.399063446], "1796": [17.2770776536], "1797": [19.4982931103], "1798": [14.0735642904], "1799": [11.8060079095], "1800": [15.499824225], "1801": [14.9245703843], "1802": [41.2976792245], "1803": [20.6569410268], "1804": [33.3705653235], "1805": [33.0120609534], "1806": [41.6236883687], "1807": [22.6130215012], "1808": [29.0463514068], "1809": [36.3229944355], "1810": [21.9010597416], "1811": [28.0348336879], "1812": [23.1191827523], "1813": [26.0528761572], "1814": [26.3299859005], "1815": [20.6305329255], "1816": [14.4071187629], "1817": [22.3334051175], "1818": [23.831150749], "1819": [15.4220871676], "1820": [16.1706898942], "1821": [24.7495107746], "1822": [19.7413458778], "1823": [18.569427611], "1824": [31.2500192159], "1825": [26.2154586804], "1826": [19.0183145789], "1827": [28.067009045], "1828": [26.7250901492], "1829": [25.3582680497], "1830": [20.3632151459], "1831": [12.1335040721], "1832": [21.5756712542], "1833": [36.0947930473], "1834": [19.8620953818], "1835": [17.6259093511], "1836": [24.7725311141], "1837": [23.4298236517], "1838": [18.572794684], "1839": [20.1218709335], "1840": [26.6601544776], "1841": [19.050172749], "1842": [15.9645358951], "1843": [19.4589401085], "1844": [34.4874314846], "1845": [21.4753623737], "1846": [20.648933353], "1847": [18.9388694769], "1848": [22.0133625661], "1849": [21.6446203823], "1850": [22.4839823386], "1851": [20.6114923128], "1852": [26.5894489645], "1853": [25.2578082273], "1854": [24.6744320781], "1855": [20.3693628836], "1856": [21.1975028365], "1857": [21.2774553415], "1858": [16.6699649966], "1859": [19.6246166279], "1860": [23.031519513], "1861": [17.2229935652], "1862": [15.4609256453], "1863": [15.3101513481], "1864": [18.9350884113], "1865": [25.9333987579], "1866": [17.9394535397], "1867": [20.0244923596], "1868": [13.7222824655], "1869": [17.4530090564], "1870": [23.153537696], "1871": [16.1436869602], "1872": [18.3126791895], "1873": [23.4034255201], "1874": [16.6855265617], "1875": [18.7542250772], "1876": [18.1694107447], "1877": [17.1761275825], "1878": [15.6245983827], "1879": [16.0865936099], "1880": [20.2580627129], "1881": [19.268633527], "1882": [21.7532586343], "1883": [22.3105559247], "1884": [22.1179707314], "1885": [20.8070416054], "1886": [21.3561106875], "1887": [20.0732002332], "1888": [19.3039659425], "1889": [26.2390799072], "1890": [25.9005838176], "1891": [22.9343766496], "1892": [23.6503359882], "1893": [25.7646089265], "1894": [23.7693435614], "1895": [23.5271172727], "1896": [21.0204623779], "1897": [25.6825429827], "1898": [24.6776615668], "1899": [26.8616709713], "1900": [25.6120783705], "1901": [24.90708605], "1902": [26.9771535855], "1903": [24.9105793788], "1904": [24.5508701365], "1905": [24.6965643333], "1906": [23.7868682802], "1907": [27.2194190959], "1908": [24.7869405561], "1909": [29.5896957155], "1910": [27.0629385687], "1911": [26.0342435364], "1912": [27.8311212186], "1913": [30.0724276531], "1914": [27.8052108741], "1915": [35.53184332], "1916": [39.628729588], "1917": [39.4830715967], "1918": [39.6545030295], "1919": [42.2839161647], "1920": [36.5895155109], "1921": [32.7598171679], "1922": [32.8512215928], "1923": [23.3367446546] }, { "1750": [9.9053697466], "1751": [11.913555496], "1752": [74.9762404359], "1753": [13.7881947508], "1754": [48.375675878], "1755": [24.101050016], "1756": [55.4279197311], "1757": [27.5046463075], "1758": [103.6401763701], "1759": [21.4395012858], "1760": [21.2232592377], "1761": [14.9874380592], "1762": [38.1512164417], "1763": [25.6385177197], "1764": [13.7991494362], "1765": [23.0931377734], "1766": [15.4376506401], "1767": [20.0997485697], "1768": [25.0214870676], "1769": [29.577571058], "1770": [27.8015375964], "1771": [27.5272448525], "1772": [21.0406931884], "1773": [13.6182936179], "1774": [44.8323740752], "1775": [32.8139209109], "1776": [25.9804245058], "1777": [21.4377815377], "1778": [31.2788973558], "1779": [42.4176979419], "1780": [70.5190252286], "1781": [15.9081290507], "1782": [35.9265090366], "1783": [23.1390290594], "1784": [36.9218145771], "1785": [25.1217393859], "1786": [18.2969303789], "1787": [11.7158915868], "1788": [42.7998202595], "1789": [26.590997225], "1790": [26.7187380797], "1791": [24.6086904743], "1792": [47.0052416491], "1793": [34.2580957423], "1794": [68.3544541342], "1795": [47.8370471866], "1796": [43.826570139], "1797": [56.9648160671], "1798": [31.9457024629], "1799": [33.716219153], "1800": [14.3089486944], "1801": [38.136755478], "1802": [63.3516537071], "1803": [51.2289470331], "1804": [61.7710308023], "1805": [68.2850964513], "1806": [105.0634831342], "1807": [59.3385685359], "1808": [66.7121950203], "1809": [70.0880969005], "1810": [52.9568541553], "1811": [69.252236967], "1812": [57.9056627158], "1813": [60.3352419092], "1814": [62.7361451752], "1815": [35.1074915166], "1816": [40.4702510354], "1817": [28.4566266495], "1818": [37.8991354401], "1819": [34.349830542], "1820": [35.4521428587], "1821": [35.8038676613], "1822": [47.0558079245], "1823": [44.9458528268], "1824": [47.918696664], "1825": [55.721230679], "1826": [36.3909870482], "1827": [49.4113965283], "1828": [38.9033911201], "1829": [46.78164262], "1830": [35.547535731], "1831": [21.9530227952], "1832": [46.1517360223], "1833": [59.5243202553], "1834": [37.2304476119], "1835": [30.883427435], "1836": [44.1650943235], "1837": [48.6726909772], "1838": [36.4790752557], "1839": [38.6009816263], "1840": [38.8496648161], "1841": [27.3121364128], "1842": [27.3684020048], "1843": [31.6127425858], "1844": [42.3821235332], "1845": [35.6508435912], "1846": [34.1087474519], "1847": [33.8867757597], "1848": [32.4627669666], "1849": [33.3484162553], "1850": [40.0226057617], "1851": [37.8229135194], "1852": [39.5633759886], "1853": [41.9458989525], "1854": [37.7837551875], "1855": [31.1602932915], "1856": [32.1130132453], "1857": [29.1889413933], "1858": [25.1858502541], "1859": [29.8571794136], "1860": [32.6855147427], "1861": [26.1641990769], "1862": [22.5744723077], "1863": [21.8275818018], "1864": [25.600515015], "1865": [30.8602781297], "1866": [23.3177764198], "1867": [24.7758098676], "1868": [19.6561192281], "1869": [20.8388417065], "1870": [34.2028435981], "1871": [19.0793296686], "1872": [22.1103389675], "1873": [23.2383266342], "1874": [21.8799562824], "1875": [25.9885416669], "1876": [22.9261456892], "1877": [22.3085770749], "1878": [18.716674849], "1879": [19.3167385726], "1880": [22.8243790108], "1881": [22.7606841077], "1882": [25.1802952753], "1883": [26.0772171616], "1884": [25.8242095366], "1885": [23.1865779646], "1886": [24.2008166042], "1887": [23.7427199604], "1888": [22.9822807663], "1889": [27.7817982193], "1890": [26.9027461325], "1891": [23.9331464892], "1892": [24.3464633166], "1893": [26.6437102212], "1894": [26.2446713401], "1895": [26.2303739834], "1896": [23.1517016195], "1897": [25.0923086997], "1898": [27.605024418], "1899": [29.3257865854], "1900": [21.3608430817], "1901": [28.3114199041], "1902": [28.6059751483], "1903": [27.7773501448], "1904": [27.1678355377], "1905": [24.5091369695], "1906": [26.0157055088], "1907": [26.0382689019], "1908": [24.6921224531], "1909": [30.4411305631], "1910": [27.4988071332], "1911": [24.4513250447], "1912": [27.3410489277], "1913": [26.4960554457], "1914": [24.4238656611], "1915": [28.9020242534], "1916": [35.5139547688], "1917": [34.3479870887], "1918": [31.5046807131], "1919": [34.7305399656], "1920": [28.3572887976], "1921": [25.0282075859], "1922": [24.5054056342], "1923": [16.9688363818] }],
    searchLimits: [{ "word": ["freedom"], "date_year": { "$gte": 1750, "$lte": 1923 } }, { "word": ["liberty"], "date_year": { "$gte": 1750, "$lte": 1923 } }],

};

MultiLineD3Graph.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.object,
    searchLimits: PropTypes.array,
    data: PropTypes.array,
};

export default MultiLineD3Graph;