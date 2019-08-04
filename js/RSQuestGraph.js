// Quests and their prerequisites
var questGraph = {
	"Cook's Assistant": [],
	"Romeo & Juliet": [],
	"The Restless Ghost": [],
	"Priest in Peril": [],
	"Enlightened Journey": [],
	"Watchtower": [],
	"The Grand Tree": [],
	"Tree Gnome Village": [],
	"Death Plateau": [],
	"Nature Spirit": ["The Restless Ghost", "Priest in Peril"],
	"Monkey Madness II": ["Enlightened Journey", "The Eyes of Glouphire", "Freeing King Awowogei", "Troll Stronghold", "Watchtower"],
	"The Eyes of Glouphire": ["The Grand Tree"],
	"Freeing King Awowogei": ["Monkey Madness I"],
	"Monkey Madness I": ["The Grand Tree", "Tree Gnome Village"],
	"Troll Stronghold": ["Death Plateau"]
};

var nodes = [], edges = [];

for (var quest in questGraph) {
	// Add quest to nodes
	if (!nodes.includes(quest))
		nodes.push(quest);

	// Add prerequisites to edges
	var prerequisites = questGraph[quest];

	for (var i = 0; i < prerequisites.length; i++) {
		edges.push([prerequisites[i], quest]);
	}
}

var graphJSON = {
	"nodes": nodes,
	"edges": edges
};


// Performs a Depth First Search from the selected node until a quest without prerequisites is reached
var DFSHelper = function helper(name, path) {
	path.push(name);

	var prerequisites = questGraph[name];

	for (var i = 0; i < prerequisites.length; i++) {
		helper(prerequisites[i], path);
	}

	return path;
}

var DFS = function(name) {
	return DFSHelper(name, []);
}

jQuery(function(){
	var graph = new Springy.Graph();
	graph.loadJSON(graphJSON);
	var springy = jQuery('#graphCanvas').springy({
		graph: graph,
		nodeSelected: function(node) {
			var questName = node.data["label"];

			var results = DFS(questName);
			results = results.reverse();

			var path = [];
			
			// Filter out duplicate quests
			for (var i = 0; i < results.length; i++) {
				if (!path.includes(results[i]))
					path.push(results[i]);
			}

			$("#quest_order").html(path.join(" -> "));
		}
	});
});