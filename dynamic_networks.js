var width = 952,
  height = 500;
var crossing_iteration = 0;


function get_angle(x, y){
  var angle = Math.atan(y/x)
  if(x>0)
    return angle
  else
    return angle + Math.PI
}

  function angular_res_force(nodes){
    //console.log(myGraph.AdjList);
    window.simulation.alpha(1).restart();
    //console.log(window.simulation.alpha())
    var id_to_nodes = {}
    for (var i = 0, n = nodes.length; i < n; ++i) {
      id_to_nodes[nodes[i].id] = nodes[i]
    }
    //console.log("id_to_nodes", id_to_nodes)
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var cur_node = nodes[i]
      //console.log("cur_node", cur_node)
      var nghbrs = myGraph.AdjList.get(cur_node.id)
      //console.log("nghbrs", nghbrs)
      //var id_angle = []        
      var my_map = new Map()
      for (var j=0; j<nghbrs.length; j++){
        var cur_nghbr = id_to_nodes[nghbrs[j]]
        //console.log("cur_nghbr", cur_nghbr)
        var edge_vector = [cur_nghbr.x-cur_node.x, cur_nghbr.y-cur_node.y]
        //console.log("edge_vector", edge_vector)
        //console.log("angle", get_angle(edge_vector[0], edge_vector[1]))
        my_map.set(nghbrs[j], get_angle(edge_vector[0], edge_vector[1]))
        //id_angle.push(my_map)
      }
      //console.log("my_map", my_map)
      var sorted_angles = new Map([...my_map.entries()].sort((a, b)=> a[1]-b[1]))
      //console.log(sorted_angles)
      //console.log(sorted_angles.keys())
      
      var item, iterator = sorted_angles.keys()
      var sorted_arr = []
      while( item = iterator.next(), !item.done)
      {
        sorted_arr.push(item.value)
      }
      //console.log(id_angle.sort(d => d["angle"]))
      if(sorted_arr.length>1)
      {
        for(var j = 0; j<sorted_arr.length; j++)
        {
           var cur = sorted_arr[j]
           var prev = sorted_arr[sorted_arr.length-1]
           if(j>0)
             prev = sorted_arr[j-1]
           //console.log(prev, cur)
           var first_node = id_to_nodes[prev]
           var second_node = id_to_nodes[cur]
           var sector = Math.abs(sorted_angles.get(cur)-sorted_angles.get(prev))
           //console.log("sector", sector)
           var first_edge_vector = [first_node.x-cur_node.x, first_node.y-cur_node.y]
           var second_edge_vector = [second_node.x-cur_node.x, second_node.y-cur_node.y]
           var ang_force_wght = 0.01*Math.abs(sector-(2*Math.PI/sorted_arr.length))
           //var ang_force_wght = 0.2*window.simulation.alpha()
           if(sector>(2*Math.PI/sorted_arr.length))
           {
             //console.log("Large sector")
             // first -> anti clockwise, second -> clockwise
             var orthogonal_first = [-first_edge_vector[1], first_edge_vector[0]]
             var orthogonal_second = [second_edge_vector[1], -second_edge_vector[0]]
             first_node.vx += ang_force_wght*orthogonal_first[0]
             first_node.vy += ang_force_wght*orthogonal_first[1]
             second_node.vx += ang_force_wght*orthogonal_second[0]
             second_node.vy += ang_force_wght*orthogonal_second[1]
           }
           else if(sector < (2*Math.PI/sorted_arr.length))
           {
             //console.log("Small sector")
             // first -> clockwise, second -> anti-clockwise
             var orthogonal_first = [first_edge_vector[1], -first_edge_vector[0]]
             var orthogonal_second = [-second_edge_vector[1], second_edge_vector[0]]
             first_node.vx += ang_force_wght*orthogonal_first[0]
             first_node.vy += ang_force_wght*orthogonal_first[1]
             second_node.vx += ang_force_wght*orthogonal_second[0]
             second_node.vy += ang_force_wght*orthogonal_second[1]
           }
        }
      }
    }
  }

function dot_prod(x, y)
{
  return x[0]*y[0] + x[1]*y[1]
}

function crossing_angle_force(){
  window.simulation.alpha(1).restart();
  var res = linkCrossingsParam(window.simulation.force("link").links());
  var nodes = window.simulation.nodes();
  //console.log(res)
  for(var i=0;i<res.length;i++)
  {
    var crossing = res[i]
    var u = nodes[crossing[0][0].index]
    var v = nodes[crossing[0][1].index]
    var w = nodes[crossing[1][0].index]
    var x = nodes[crossing[1][1].index]
    // find left and right vertices for each edge
    if(u.x>v.x)
    {
      var temp = u
      u = v
      v = temp
    }
    if(w.x>x.x)
    {
      var temp = w
      w = x
      x = temp
    }

    // find largest left, assigh that as a
    var a = u
    var b = v
    var c = w
    var d = x
    if(u.y<w.y)
    {
       a = w
       b = x
       c = u
       d = v
    }

    var ab = [b.x-a.x, b.y-a.y]
    var cd = [d.x-c.x, d.y-c.y]
    var len_ab = Math.sqrt(dot_prod(ab, ab))
    var len_cd = Math.sqrt(dot_prod(cd, cd))
    var cos_t = dot_prod(ab, cd)/(len_ab*len_cd)

    if(cos_t<0)
      cos_t = -cos_t

    var k = 5.0

    var x_force = k*cos_t*(d.x-c.x)/len_cd
    var y_force = k*cos_t*(d.y-c.y)/len_cd
    a.vx += x_force
    a.vy += y_force

    x_force = k*cos_t*(c.x-d.x)/len_cd
    y_force = k*cos_t*(c.y-d.y)/len_cd
    b.vx += x_force
    b.vy += y_force

    x_force = k*cos_t*(b.x-a.x)/len_ab
    y_force = k*cos_t*(b.y-a.y)/len_ab
    c.vx += x_force
    c.vy += y_force

    x_force = k*cos_t*(a.x-b.x)/len_ab
    y_force = k*cos_t*(a.y-b.y)/len_ab
    d.vx += x_force
    d.vy += y_force
  }

}


function euclid_dis(u, v)
{
  var x = [u.x-v.x, u.y-v.y]
  return Math.sqrt(dot_prod(x, x))
}

function neighborhood_preservation()
{
  window.simulation.alpha(1).restart();
  var nodes = window.simulation.nodes();
  var pairwise_matrix = []
  for(var i=0;i<nodes.length;i++)
  {
    pairwise_matrix.push([])
    for(var j=0;j<nodes.length;j++)
    {
      var u = nodes[nodes[i].index]
      var v = nodes[nodes[j].index]
      var dis = euclid_dis(u,v)
      pairwise_matrix[i].push({distance:dis, index:j})
    }
  }
  //console.log(pairwise_matrix)
  var k = 3
  var force_factor = .1
  for(var i=0;i<nodes.length;i++)
  {
    pairwise_matrix[i].sort((a, b) => a.distance - b.distance)
    //console.log(pairwise_matrix[i])
    //console.log(myGraph.AdjList.get(i));
    for(j=1;(j<k)&&(j<nodes.length);j++)
    {
      var nghbr = pairwise_matrix[i][j]
      if(!myGraph.AdjList.get(i).includes(nghbr))
      {
        console.log(nghbr.index, "not adjacent to", i)
        var u = nodes[nodes[i].index]
        var v = nodes[nghbr.index]
        v.vx += (v.x-u.x)*force_factor
        v.vy += (v.y-u.y)*force_factor
      }
    }
  }
}

function set_view_size()
{
  d3.select("div.float-child").style("width", width+50);
  d3.select("div.float-child").style("height", height+50);
  d3.select("svg").style("width", width);
  d3.select("svg").style("height", height);
}

function draw()
{
  d3.select("svg").selectAll("*").remove();
  var txt = document.getElementById("input_text").value;
  //var txt = "1--2\n2--3\n3--4";
  //var lines = txt.split('\n');
  var all_edges = [];
  var edge_list = [];
  var node_list = [];
  /*for(var i=0;i<lines.length;i++)
  {
    if(lines[i].replace(/\s/g, "")=="")continue;
    var edge = lines[i].split("--");
    edge[0] = edge[0].replace(/\s/g, "");
    edge[1] = edge[1].replace(/\s/g, "");
    //if(all_nodes.findIndex(x => x==edge[0])==-1)all_nodes.push(edge[0]);
    //if(all_nodes.findIndex(x => x==edge[1])==-1)all_nodes.push(edge[1]);
    all_edges.push({source_label:edge[0], target_label:edge[1]});
  }*/
  var G_json = JSON.parse(txt)
  var number_of_nodes = G_json["edges"].length+1;
  // check if number of nodes is correct
  var node_set = new Set();
  for(var i=0;i<G_json["edges"].length;i++)
  {
    var cur_edge = G_json["edges"][i]
    node_set.add(cur_edge.source)
    node_set.add(cur_edge.target)
  }
  //console.log("node_set", node_set)
  number_of_nodes = node_set.size
  myGraph = new MyGraph(number_of_nodes);
  myGraph.addVertex(0);
  for(var i=0;i<G_json["edges"].length;i++)
  {
    var edge = G_json["edges"][i];
    all_edges.push({source_label:edge["source"]+"", target_label:edge["target"]+""});
  }  

  node_list.push(all_edges[0].source_label);
  
  all_edges.reverse();
  window.all_edges = all_edges;

  if(document.getElementById("non_iterative").checked){
    while(all_edges.length>0){
      var edge = all_edges.pop();
      var targetNodeLabel = edge.target_label;
      var sourceIndex = node_list.findIndex(d => d == edge.source_label);
      var targetIndex = node_list.findIndex(d => d == edge.target_label);
      if(targetIndex==-1)
      {
        node_list.push(targetNodeLabel);
        targetIndex = node_list.length - 1;
        myGraph.addVertex(targetIndex);
      }
      myGraph.addEdge(sourceIndex, targetIndex);
      edge_list.push(edge);
    }
  }

  //console.log(edge_list);
  //console.log(node_list);
  var svg = d3.select("svg");

  var nodes = [];
  for(var i=0;i<node_list.length;i++)
  {
    nodes.push({"label":node_list[i], "id":i});
  }

  var nodeHash = nodes.reduce((hash, node) => {hash[node.label] = node;
    return hash;
    }, {})

  edge_list.forEach(edge => {
    edge.weight = 1;
    edge.source = nodeHash[edge.source_label];
    edge.target = nodeHash[edge.target_label];
    })

  var rev_scale = d3.scaleLinear().domain([1, 10]).range([1, .1]);
  var stability = rev_scale(parseInt(document.getElementById("myRange").value));

  var manyBody = d3.forceManyBody().strength(-50 * stability);
  var forceLink = d3.forceLink().strength(stability);
  //var forceLink = d3.forceLink();
  var center = d3.forceCenter().x(width/2).y(height/2);

  var collide_scale = d3.scaleLinear().domain([1, 10]).range([5, 30]);
  var collision_radius = collide_scale(parseInt(document.getElementById("collideRange").value));

  var simulation = d3.forceSimulation()
   .force("charge", manyBody)
   .force("center", center)
   .force("link", forceLink)
   //.force("collision", d3.forceCollide(collision_radius))
   .nodes(nodes)
   .on("tick", updateNetwork);  
  window.simulation = simulation;

  simulation.force("link").links(edge_list);

  var len_scale = d3.scaleLinear().domain([1, 10]).range([1, 100]);
  var len_range = len_scale(parseInt(document.getElementById("lenRange").value));
  if(len_range>=2)
  {
    simulation.force("link").links(edge_list).distance(function(d) {return len_range;});
  }

  graphNodesEnter = d3.select("svg")
   .selectAll("circle")
   .data(nodes)
   .enter()
   .append("circle")
   .style("fill", "red")
   .attr("r", 5);

  let drag =
      d3.drag()
        .on("start", d => handleDragStarted(d, simulation))
        .on("drag", d => handleDragged(d))
        .on("end", d => handleDragEnded(d, simulation));
      graphNodesEnter.call(drag);

  d3.select("svg").selectAll("line.link")
   .data(edge_list, d => `${d.source_label}-${d.target_label}`) .enter()
   .append("line")
   .attr("class", "link")
   .style("opacity", .5)
   .style("stroke-width", d => d.weight);

  var norm_scale = d3.scaleLinear().domain([1, 10]).range([.1, 1.0]);
  var area_weight = norm_scale(parseInt(document.getElementById("areaRange").value));

  function box_force(left, right, top, bottom, radius) { 
    //console.log("inside box force");
    for (var i = 0, n = nodes.length; i < n; ++i) {
      curr_node = nodes[i];
      curr_node.x = Math.max(left+radius, Math.min(right - radius, curr_node.x));
      curr_node.y = Math.max(top+radius, Math.min(bottom - radius, curr_node.y));
      //console.log(curr_node.x, curr_node.y);
    }
  }


  function updateNetwork() {
   var a = height*area_weight/2;
   box_force(width/2 - a, width/2 + a, height/2 - a, height/2 + a,  5);

   //angular_res_force(window.simulation.nodes())

   //crossing_angle_force()

   d3.selectAll("circle")
     .attr("cx", d => d.x)
     .attr("cy", d => d.y);
   d3.selectAll("line.link")
     .attr("x1", d => d.source.x)
     .attr("x2", d => d.target.x)
     .attr("y1", d => d.source.y)
     .attr("y2", d => d.target.y);
  }

  if(document.getElementById("iterative").checked){
    window.addEdgeInterval = setInterval(addEdge, 1000*rev_scale(parseInt(document.getElementById("speedRange").value)));
  }
}

var crossing_scale = d3.scaleLinear().domain([1, 2, 10]).range([0, 1, 10]);
function applyCrossingForce(res)
{
    crossing_iteration += 1;
    console.log(res);
    for(var i=0;i<1;i++)
    {

      var u = -1;
      var v = -1;

      if(document.getElementById("min_comp").checked){
        var crossingPair = res[i];
        var arr = get_child_nodes(crossingPair[0], crossingPair[1]);
        var comp1 = arr[0];
        crossingPair[0] = arr[1];
        //console.log(crossingPair[0]);
        var arr = get_child_nodes(crossingPair[1], crossingPair[0]);
        var comp2 = arr[0];
        crossingPair[1] = arr[1];
        //console.log(crossingPair[1]);
        var new_coord = null;
        if(comp1.length<comp2.length)
        {
          u = crossingPair[0][0].id;
          v = crossingPair[0][1].id;
        }
        else
        {
          u = crossingPair[1][0].id;
          v = crossingPair[1][1].id;
        }
      }else{
        u = Math.max(res[i][0][0].id, res[i][0][1].id, res[i][1][0].id, res[i][1][1].id);
        if(u==res[i][0][0].id)v = res[i][0][1].id;
        else if(u==res[i][0][1].id)v = res[i][0][0].id;
        else if(u==res[i][1][0].id)v = res[i][1][1].id;
        else if(u==res[i][1][1].id)v = res[i][1][0].id;
      }

      var moveX = window.simulation.nodes()[v].x - window.simulation.nodes()[u].x;
      var moveY = window.simulation.nodes()[v].y - window.simulation.nodes()[u].y;
      var strength = crossing_scale(parseInt(document.getElementById("crossingRange").value));
      moveX *= strength;
      moveY *= strength;
      window.simulation.force('x', d3.forceX().x(function(d) {
        if(d.id==u){
          //console.log(d);
          console.log(moveX);
          return d.x + moveX;
        }
        else
        {
          return d.x - moveX;
        }
      }));
      window.simulation.force('y', d3.forceY().y(function(d) {
        if(d.id==u){
          console.log(d);
          console.log(moveY);
          return d.y + moveY;
        }
        else
        {
          return d.y - moveY;
        }
      }));
      if(strength>0)window.simulation.alpha(1).restart();
    }
}

function addEdge()
{
  var res = linkCrossingsParam(window.simulation.force("link").links());
  var strength = crossing_scale(parseInt(document.getElementById("crossingRange").value));
  var crossing_force_condition = (res.length>0)&&(strength>0)&&(crossing_iteration<50);
  if(window.all_edges.length>0)
  {
    //console.log("crossing_iteration", crossing_iteration);
    if(crossing_force_condition)applyCrossingForce(res);
    else{
      crossing_iteration = 0;
      var simulation = window.simulation;
      var edge = window.all_edges.pop();
      var sourceIndex = simulation.nodes().findIndex(d => d.label == edge.source_label);
      var targetIndex = simulation.nodes().findIndex(d => d.label == edge.target_label);
      var sourceNode = simulation.nodes()[sourceIndex];
      var targetNodeLabel = edge.target_label;
      simulation.stop();
      var oldEdges = simulation.force("link").links()
      var oldNodes = simulation.nodes()
      var newNode = null;
      if(targetIndex==-1)
      {
        newNode = {"label":targetNodeLabel, x: sourceNode.x, y: sourceNode.y, id: oldNodes.length}; 
      }
      else
      {
        newNode = simulation.nodes()[targetIndex];
      }
      var newEdge = {source: sourceNode, target: newNode, index: oldEdges.length};
      oldEdges.push(newEdge);
      if(targetIndex==-1)
      {
        oldNodes.push(newNode);
      }
      simulation.force("link").links(oldEdges);
      simulation.nodes(oldNodes);
      if(targetIndex==-1)
      {
        myGraph.addVertex(newNode.id);
      }
      myGraph.addEdge(sourceNode.id, newNode.id);

      graphNodesEnter = d3.select("svg")
       .selectAll("circle")
       .data(oldNodes)
       .enter()
       .append("circle")
       .style("fill", "red")
       .attr("r", 5);


      let drag =
        d3.drag()
        .on("start", d => handleDragStarted(d, simulation))
        .on("drag", d => handleDragged(d))
        .on("end", d => handleDragEnded(d, simulation));
      graphNodesEnter.call(drag);

      d3.select("svg").selectAll("line.link")
       .data(oldEdges, d => `${d.source_label}-${d.target_label}`) .enter()
       .append("line")
       .attr("class", "link")
       .style("opacity", .5)
       .style("stroke-width", d => d.weight);
    }

    window.simulation.alpha(0.1);
    window.simulation.restart();
  }
  else
  {
    if(crossing_force_condition)applyCrossingForce(res);
    else{
      clearInterval(window.addEdgeInterval);
      //window.simulation.stop();
    }
  }
}


function handleDragStarted(d, simulation) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
  }

function handleDragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

function handleDragEnded(d, simulation) {
    if (!d3.event.active) simulation.alphaTarget(0);

    d.fx = undefined;
    d.fy = undefined;
  }

