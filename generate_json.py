import networkx as nx
import json

G = nx.balanced_tree(2, 2)
#G = nx.balanced_tree(2, 3)
#G = nx.balanced_tree(2, 4)
#print(G.edges())

G_json = dict()
G_json["edges"] = []
for e in G.edges():
  u, v = e
  G_json["edges"].append({"source":u, "target":v})
#print(G_json)

out_file = open("tree.json", "w")
json.dump(G_json, out_file, indent = 6)
#json.dump(G_json, out_file)
out_file.close()

