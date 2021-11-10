// Queue class 
class Queue 
{ 
	// Array is used to implement a Queue 
	constructor() 
	{ 
		this.items = []; 
	} 
				
	// Functions to be implemented 
	// enqueue(item) 
// enqueue function 
enqueue(element) 
{	 
	// adding element to the queue 
	this.items.push(element); 
} 

	// dequeue() 
// dequeue function 
dequeue() 
{ 
	// removing element from the queue 
	// returns underflow when called 
	// on empty queue 
	if(this.isEmpty()) 
		return "Underflow"; 
	return this.items.shift(); 
} 

	// front() 
// front function 
front() 
{ 
	// returns the Front element of 
	// the queue without removing it. 
	if(this.isEmpty()) 
		return "No elements in Queue"; 
	return this.items[0]; 
} 

	// isEmpty() 
// isEmpty function 
isEmpty() 
{ 
	// return true if the queue is empty. 
	return this.items.length == 0; 
} 

	// printQueue() 
// printQueue function 
printQueue() 
{ 
	var str = ""; 
	for(var i = 0; i < this.items.length; i++) 
		str += this.items[i] +" "; 
	return str; 
} 

} 


class MyGraph {
    constructor(noOfVertices) 
    { 
        this.noOfVertices = noOfVertices; 
        this.AdjList = new Map(); 
    }

    // add vertex to the graph 
    addVertex(v) 
    { 
	// initialize the adjacent list with a 
	// null array 
	this.AdjList.set(v, []); 
    } 

    // add edge to the graph 
    addEdge(v, w) 
    {
	// get the list for vertex v and put the 
	// vertex w denoting edge between v and w 
	/*if(typeof this.AdjList.get(v)=='undefined')this.AdjList.set(v, [w]);
        else this.AdjList.get(v).push(w);*/
        //if(typeof this.AdjList.get(v)=='undefined'){graph.simulation.stop();stopAddingEdges();stopRemovingSmallCompMultipleSafe();return;}
        this.AdjList.get(v).push(w); 

	// Since graph is undirected, 
	// add an edge from w to v also 
	/*if(typeof this.AdjList.get(w)=='undefined')this.AdjList.set(w, [v]);
	else this.AdjList.get(w).push(v);*/
        //if(typeof this.AdjList.get(w)=='undefined'){graph.simulation.stop();stopAddingEdges();stopRemovingSmallCompMultipleSafe();return;}
	this.AdjList.get(w).push(v);

    }

    // remove edge from the graph 
    removeEdge(v, w) 
    { 
        var arr = this.AdjList.get(v);
        if(typeof arr == 'undefined')
        {
          graph.simulation.stop();
          return;
        }
        for( var i = 0; i < arr.length; i++){ if ( arr[i] === w) { arr.splice(i, 1); }}
        arr = this.AdjList.get(w);
        if(typeof arr == 'undefined')
        {
          graph.simulation.stop();
          return;
        }
        for( var i = 0; i < arr.length; i++){ if ( arr[i] === v) { arr.splice(i, 1); }}
    }

    // Prints the vertex and adjacency list 
    printGraph() 
    { 
	// get all the vertices 
	var get_keys = this.AdjList.keys(); 

	// iterate over the vertices 
	for (var i of get_keys) 
        { 
		// great the corresponding adjacency list 
		// for the vertex 
		var get_values = this.AdjList.get(i); 
		var conc = ""; 

		// iterate over the adjacency list 
		// concatenate the values into a string 
		for (var j of get_values) 
			conc += j + " "; 

		// print the vertex and its adjacency list 
		console.log(i + " -> " + conc); 
	} 
    }

    // function to performs BFS 
    bfs(startingNode) 
    { 
        var bfsTraversal = [];

	// create a visited array 
	var visited = []; 
	for (var i = 0; i < this.noOfVertices; i++) 
		visited[i] = false; 

	// Create an object for queue 
	var q = new Queue(); 

	// add the starting node to the queue 
	visited[startingNode] = true; 
	q.enqueue(startingNode); 

	// loop until queue is element 
	while (!q.isEmpty()) { 
		// get the element from the queue 
		var getQueueElement = q.dequeue(); 

		// passing the current vertex to callback funtion 
		//console.log(getQueueElement); 
                bfsTraversal.push(getQueueElement);

		// get the adjacent list for current vertex 
		var get_List = this.AdjList.get(getQueueElement); 

		// loop through the list and add the element to the 
		// queue if it is not processed yet 
		for (var i in get_List) { 
			var neigh = get_List[i]; 

			if (!visited[neigh]) { 
				visited[neigh] = true; 
				q.enqueue(neigh); 
			} 
		} 
	} 
        return bfsTraversal;
    }
 
    bfs_depth(startingNode)
    {   
        var bfsTraversal = [];
        
        // create a visited array
        var visited = []; 
        for (var i = 0; i < this.noOfVertices; i++)
                visited[i] = false;
        
        // Create an object for queue
        var q = new Queue();
        
        // add the starting node to the queue
        visited[startingNode] = true;
        q.enqueue([startingNode,0]);
        
        // loop until queue is element
        while (!q.isEmpty()) { 
                // get the element from the queue 
                var nodeDepth = q.dequeue();
                var getQueueElement = nodeDepth[0];
                
                // passing the current vertex to callback funtion
                //console.log(getQueueElement); 
                bfsTraversal.push(nodeDepth);
                
                // get the adjacent list for current vertex 
                var get_List = this.AdjList.get(getQueueElement);
                
                // loop through the list and add the element to the
                // queue if it is not processed yet
                for (var i in get_List) { 
                        var neigh = get_List[i];
                        
                        if (!visited[neigh]) { 
                                visited[neigh] = true;
                                q.enqueue([neigh, nodeDepth[0]+1]);
                        }
                }
        } 
        return bfsTraversal;
    }
}

