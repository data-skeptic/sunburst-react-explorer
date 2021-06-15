import React, {Component} from 'react';
import * as d3 from "d3";
import { svg } from 'd3';

class ZoomableSunburst extends Component {
    componentDidMount() {
        this.drawVisualization();
    }

    constructor(props){
        super(props);
        this.state = {
            data: this.props.jsonThing
        }
    }
      
    drawVisualization() {

        console.log(this.state.data);
        console.log("reloaded");
        //d3.json("exampleDataset.json").then( data => {
            const data = exampleData;
            //const d = exampleData;
            var width = 750;
            var radius = width / 6;
            var currentDepth = 0; 

            const svg2 = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", width)
                .style("border", "2px solid lightgrey")
                .style("margin", "50px")                 

            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            var partition = d3.partition().size([2 * Math.PI, root.height + 1])(root)

            root.each(d => d.current = d);

            const g = svg2.append("g")
                .attr("transform", `translate(${width / 2},${width / 2})`);

            svg2.append("text")
                .text("")
                .attr("class", "name")
                .attr("x", width/2)
                .attr("y", width/2 - 10)
                .style("font-family", "sans-serif")
                .style("dominant-baseline", "middle")
                .style("text-anchor", "middle")
                .style("font-size", "13px");    

            svg2.append("text")
                .text("")
                .attr("class", "gb")
                .attr("x", width/2)
                .attr("y", width/2 + 10)
                .style("font-family", "sans-serif")
                .style("dominant-baseline", "middle")
                .style("text-anchor", "middle")
                .style("font-size", "13px"); 

            const colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

            var totalList = root.descendants();
            var currentList = root.descendants();

            var current1 = currentList.filter( (d) => {
                return d['depth'] == currentDepth + 1;
            });
            var current2 = currentList.filter( (d) => {
                return d['depth'] == currentDepth + 2;
            });

            var checkRoot;
            var parentName = null;
            parentName = root.data.name;
            
            function createSunburst(rootName){

                var all = d3.selectAll("g > *");
                //all.transition().duration(750).attr("opacity", 0).attr("stroke-width", 0);

                all.remove();

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
                console.log(root);
                
                if (root.parent !== null) {
                    parentName = root.parent.data.name;
                }
                let rootCircle = g.append("path")
                        .attr("class", "arc")
                        .attr("fill", colorScale(root.data.name))
                        .attr("fill-opacity", .2)
                        .attr("stroke","black")
                        .attr("stroke-width", 0)
                        .attr("name", parentName)
                        .attr("currentname", root.data.name)
                        .attr("opacity", 0.5)
                        .attr("val", root.value)
                        .attr("d", d3.arc()
                            .innerRadius(0)
                            .outerRadius(95)
                            .padAngle(Math.min((root.x1 - root.x0) / 2, 0.005))
                            .startAngle(root.x0)
                            .endAngle(root.x1));
                console.log(root.value);
                rootCircle.on("mouseover", function() {
                    d3.select(this)
                        .transition().duration(50)
                        .attr("stroke","black")
                        .attr("stroke-width", 3)
                    d3.select(".name").transition().duration(50).attr("opacity", 0.7);    
                    d3.select(".name").text(this.getAttribute("currentname"));    
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
                            .attr("name", d.data.name)
                            .attr("val", d.value)
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
                        d3.select("text").transition().duration(50).attr("opacity", 0.7);    
                        d3.select("text").text(this.getAttribute("name"));        
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
                        d3.select("text").transition().duration(50).attr("opacity", 0.7);    
                        d3.select("text").text(this.getAttribute("name"));    
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
        
        return svg2;
        }
          
    render(){
        console.log(this.state.data);
        return this.drawVisualization();
        //return svg;
        
    }
  }
      
  const exampleData = {
    "name": "D Drive",
    "children": [
      {
        "name": "Pictures",
        "children": [
          {
            "name": "New York City Trip",
            "children": [
              {
                "name": "EmpireStateBuilding.png",
                "value": 3938
              },
              {
                "name": "StatueOfLiberty.png",
                "value": 3812
              },
              {
                "name": "TimeSquare.png",
                "value": 2914
              },
              {
                "name": "GroupPhoto.png",
                "value": 4743
              }
            ]
          },
          {
            "name": "Family Photos",
            "children": [
              {
                "name": "FamilyDinner.png",
                "value": 3534
              },
              {
                "name": "FamilyDinner2.png",
                "value": 5731
              },
              {
                "name": "SkiTrip.png",
                "value": 4840
              },
              {
                "name": "Grandparents.png",
                "value": 5914
              },
              {
                "name": "Kids.png",
                "value": 3416
              }
            ]
          },
          {
            "name": "Art",
            "children": [
              {
                "name": "StillLife.png",
                "value": 9074
              }
            ]
          }
        ]
      },
      {
        "name": "Projects",
        "children": [
          {
            "name": "GameProject",
            "value": 12010
          },
          {
            "name": "AnimationProject",
            "value": 15842
          },
          {
            "name": "Digital Art Projects",
            "children": [
              {
                "name": "Art1",
                "value": 1983
              },
              {
                "name": "Art2",
                "value": 2047
              },
              {
                "name": "Art3",
                "value": 1375
              },
              {
                "name": "Art4",
                "value": 8746
              },
              {
                "name": "Art5",
                "value": 2202
              },
              {
                "name": "Art6",
                "value": 1382
              },
              {
                "name": "Art7",
                "value": 1629
              },
              {
                "name": "Art8",
                "value": 1675
              },
              {
                "name": "Art9",
                "value": 2042
              }
            ]
          },
          {
            "name": "CodingProject",
            "value": 23041
          },
          {
            "name": "VideoProject",
            "value": 5176
          }
        ]
      },
      {
        "name": "Schedule",
        "children": [
          {
            "name": "ScheduleFile",
            "value": 42116
          }
        ]
      },
      {
        "name": "Games",
        "children": [
          {
            "name": "Cities Skylines",
            "value": 1616
          },
          {
            "name": "Counter Strike",
            "value": 1027
          },
          {
            "name": "Cyberpunk 2077",
            "value": 3891
          },
          {
            "name": "Witcher 3",
            "value": 891
          },
          {
            "name": "Battlefield V",
            "value": 2893
          },
          {
            "name": "Battlefield I",
            "value": 2103
          },
          {
            "name": "Doom 2016",
            "value": 3677
          },
          {
            "name": "Doom Eternal",
            "value": 5781
          },
          {
            "name": "Dorfromantik",
            "value": 441
          },
          {
            "name": "ISLANDERS",
            "value": 333
          },
          {
            "name": "The Forest",
            "value": 3130
          },
          {
            "name": "Sons of the Forest",
            "value": 3617
          },
          {
            "name": "Rainbow Six Siege",
            "value": 3240
          },
          {
            "name": "Counter Strike Global Offensive",
            "value": 2732
          },
          {
            "name": "Counter Strike Source",
            "value": 2039
          }
        ]
      },
      {
        "name": "Programs",
        "children": [
          {
            "name": "VS Code",
            "value": 2105
          },
          {
            "name": "Eclipse",
            "value": 1316
          },
          {
            "name": "Premiere Pro",
            "value": 3151
          },
          {
            "name": "Discord",
            "value": 3770
          },
          {
            "name": "GitHub Desktop",
            "value": 2435
          },
          {
            "name": "Steam",
            "value": 4839
          }
        ]
      },
      {
        "name": "Documents",
        "children": [
          {
            "name": "Reminders.docx",
            "value": 258
          },
          {
            "name": "Contract.docx",
            "value": 1001
          },
          {
            "name": "Links.docx",
            "value": 217
          },
          {
            "name": "Assignments.docx",
            "value": 2555
          },
          {
            "name": "Essays",
            "children": [
              {
                "name": "CSEssay.docx",
                "value": 354
              },
              {
                "name": "EnglishEssay.docx",
                "value": 1233
              }
            ]
          }
        ]
      }
    ]
  };

  export default ZoomableSunburst;