import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection'
import * as d3 from "d3";
import { svg } from 'd3';

const width = 750;


const Sunburst = ({ data }) => {
    const d3svg = useRef(null)
    
    useEffect(() => {
        if (data && d3svg.current) {
            
            let svg = select(d3svg.current);

            svg.append("text")
                .text("")
                .attr("class", "name")
                .attr("x", width/2)
                .attr("y", width/2 - 10)
                .style("font-family", "sans-serif")
                .style("dominant-baseline", "middle")
                .style("text-anchor", "middle")
                .style("font-size", "13px");    
            svg.append("text")
                .text("")
                .attr("class", "gb")
                .attr("x", width/2)
                .attr("y", width/2 + 10)
                .style("font-family", "sans-serif")
                .style("dominant-baseline", "middle")
                .style("text-anchor", "middle")
                .style("font-size", "13px"); 
        
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            var partition = d3.partition().size([2 * Math.PI, root.height + 1])(root)

            root.each(d => d.current = d);

            const g = svg.append("g")
                .attr("transform", `translate(${width / 2},${width / 2})`);

            const colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

            var totalList = root.descendants();
            var checkRoot;
            var parentName = null;
            parentName = root.data.name;
            
            function createSunburst(rootName){

                var all = d3.selectAll("g > *");
                //all.transition().duration(750).attr("opacity", 0).attr("stroke-width", 0);

                all.remove();

                console.log(rootName);
                var root = totalList.filter( (d) => {
                    return d.data.name == rootName;
                });
                root = root[0];
                partition = d3.partition().size([2 * Math.PI, root.height + 1])(root)

                var current1 = root.children;
                var current2 = [];
                if (typeof current1 !== "undefined" && current1 != []){
                    current1.forEach( (d,i)=>{
                        if (typeof d.children !== "undefined"){
                            d.children.forEach( (d,i)=>{
                                current2.push(d);
                            });
                        }
                    });
                }
                console.log(current2);
                
                
                if (root.parent !== null) {
                    parentName = root.parent.data.name;
                }
                console.log(root.value);
                let rootCircle = g.append("path")
                        .attr("class", "arc")
                        .attr("fill", colorScale(root.data.name))
                        .attr("fill-opacity", .2)
                        .attr("stroke","black")
                        .attr("stroke-width", 0)
                        .attr("name", parentName)
                        .attr("showName", root.data.name)
                        .attr("val", root.value)
                        .attr("opacity", 0.5)
                        .attr("d", d3.arc()
                            .innerRadius(0)
                            .outerRadius(95)
                            .padAngle(Math.min((root.x1 - root.x0) / 2, 0.005))
                            .startAngle(root.x0)
                            .endAngle(root.x1));
                rootCircle.on("mouseover", function() {
                    d3.select(this)
                        .transition().duration(50)
                        .attr("stroke","black")
                        .attr("stroke-width", 3)
                    d3.select(".name").transition().duration(50).attr("opacity", 0.7);    
                    d3.select(".name").text(this.getAttribute("showName"));    
                    d3.select(".gb").transition().duration(50).attr("opacity", 0.7);    
                    d3.select(".gb").text((this.getAttribute("val")/1000) + " GB");    
                });
                rootCircle.on("mouseout", function() {
                    d3.select(this)
                        .transition().duration(200)
                        .attr("stroke-width", 0)
                    d3.selectAll("text").transition().duration(200).attr("opacity", 0);    
                });
                if (root.depth != 0){
                    rootCircle.on("click", function() {
                        d3.select(this)
                            .transition().duration(200)
                            .attr("stroke-width", 1)
                        console.log(this.getAttribute("name"));
                        createSunburst(this.getAttribute("name"));
                    });
                }
                

                current1.forEach( (d,i)=>{
                    let arch = g.append("path")
                            .attr("class", "arc")
                            .attr("fill", colorScale(d.data.name))
                            .attr("fill-opacity", 0)
                            .attr("stroke","black")
                            .attr("stroke-width", 1)
                            .attr("opacity", 0)
                            .attr("val", d.value)
                            .attr("name", d.data.name)
                            .attr("d", d3.arc()
                                .innerRadius(100)
                                .outerRadius(200)
                                .padAngle(Math.min((d.current.x1 - d.current.x0) / 2, 0.005))
                                .startAngle(d.x0)
                                .endAngle(d.x1));
                    arch.transition().duration(250).attr("fill-opacity", 0.5).attr("opacity", 0.5);
                    arch.on("mouseover", function() {
                        d3.select(this)
                            .transition().duration(50)
                            .attr("stroke","black")
                            .attr("stroke-width", 3)
                            .attr("fill-opacity", 0.6)
                            .attr("opacity", 0.6)
                        d3.select(".name").transition().duration(50).attr("opacity", 0.7);    
                        d3.select(".name").text(this.getAttribute("name"));    
                        d3.select(".gb").transition().duration(50).attr("opacity", 0.7);    
                        d3.select(".gb").text((this.getAttribute("val")/1000) + " GB");        
                    });
                    arch.on("mouseout", function() {
                        d3.select(this)
                            .transition().duration(200)
                            .attr("stroke-width", 1)
                            .attr("fill-opacity", 0.5)
                            .attr("opacity", 0.5)
                        d3.selectAll("text").transition().duration(200).attr("opacity", 0);  
                    });
                    arch.on("click", function() {
                        d3.select(this)
                            .transition().duration(200)
                            .attr("stroke-width", 1)
                        console.log(this.getAttribute("name"));
                        checkRoot = totalList.filter( (d) => {
                            return d.data.name == this.getAttribute("name");
                        });
                        checkRoot = checkRoot[0];
                        if (typeof checkRoot.children !== "undefined"){
                            createSunburst(this.getAttribute("name"));
                        }    
                    });
                });

                current2.forEach( (d,i)=>{
                    let arch2 = g.append("path")
                            .attr("class", "arc")
                            .attr("fill",  colorScale(d.data.name))
                            .attr("fill-opacity", 0)
                            .attr("stroke","black")
                            .attr("stroke-width", 1)
                            .attr("name", d.data.name)
                            .attr("val", d.value)
                            .attr("opacity", 0)
                            .attr("d", d3.arc()
                                .innerRadius(205)
                                .outerRadius(350)
                                .padAngle(Math.min((d.current.x1 - d.current.x0) / 2, 0.005))
                                .startAngle(d.x0)
                                .endAngle(d.x1));
                    arch2.transition().duration(250).attr("fill-opacity", 0.5).attr("opacity", 0.5);            
                    arch2.on("mouseover", function() {
                        d3.select(this)
                            .transition().duration(50)
                            .attr("stroke","black")
                            .attr("stroke-width", 3)
                            .attr("fill-opacity", 0.6)
                            .attr("opacity", 0.6)
                        d3.select(".name").transition().duration(50).attr("opacity", 0.7);    
                        d3.select(".name").text(this.getAttribute("name"));    
                        d3.select(".gb").transition().duration(50).attr("opacity", 0.7);    
                        d3.select(".gb").text((this.getAttribute("val")/1000) + " GB");     
                    });
                    arch2.on("mouseout", function() {
                        d3.select(this)
                            .transition().duration(200)
                            .attr("stroke-width", 1)
                            .attr("fill-opacity", 0.5)
                            .attr("opacity", 0.5)
                        d3.selectAll("text").transition().duration(200).attr("opacity", 0); 
                    });
                    arch2.on("click", function() {
                        d3.select(this)
                            .transition().duration(200)
                            .attr("stroke-width", 1)
                        console.log(this.getAttribute("name"));
                        checkRoot = totalList.filter( (d) => {
                            return d.data.name == this.getAttribute("name");
                        });
                        checkRoot = checkRoot[0];
                        if (typeof checkRoot.children !== "undefined"){
                            createSunburst(this.getAttribute("name"));
                        }    
                    });
                });
            }
            createSunburst(root.data.name);
            
        }    
    }, [data])

    return (
        <svg
            className="sunburst-container"
            width={width}
            height={width}
            ref={d3svg}
        ></svg>
    );
}
  
      

  

export default Sunburst;