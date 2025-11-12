# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Tuple
from collections import defaultdict, deque

app = FastAPI(title="Pipeline Parser")

origins = [
    "https://vector-shift-pipeline-builder-23gp.vercel.app/",  # ✅ exact Vercel URL
    "http://localhost:5173",  # for local testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 Don't leave as ["*"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EdgeModel(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    # additional fields are ignored but accepted


class PipelinePayload(BaseModel):
    nodes: Optional[List[Dict[str, Any]]] = []
    edges: Optional[List[EdgeModel]] = []


def build_graph(nodes: List[Dict[str, Any]], edges: List[EdgeModel]) -> Tuple[set, Dict[str, List[str]], Dict[str, int]]:
    """
    Build adjacency list and indegree map. Returns:
    - set of node ids
    - adjacency dict {u: [v, ...]}
    - indegree dict {node: indegree}
    """
    node_ids = set()

    # collect node ids from nodes list if present
    for n in nodes or []:
        if isinstance(n, dict) and "id" in n:
            node_ids.add(str(n["id"]))

    # also collect node ids from edges
    for e in edges or []:
        node_ids.add(str(e.source))
        node_ids.add(str(e.target))

    # adjacency and indegree
    adj = defaultdict(list)
    indeg = {nid: 0 for nid in node_ids}

    for e in edges or []:
        s = str(e.source)
        t = str(e.target)
        # ensure keys exist
        if s not in indeg:
            indeg[s] = 0
            node_ids.add(s)
        if t not in indeg:
            indeg[t] = 0
            node_ids.add(t)
        adj[s].append(t)
        indeg[t] = indeg.get(t, 0) + 1

    return node_ids, adj, indeg


def is_dag_kahn(node_ids: set, adj: Dict[str, List[str]], indeg: Dict[str, int]) -> Tuple[bool, List[str]]:
    """
    Kahn's algorithm: return (is_dag, topo_order).
    If there is a cycle, topo_order will contain the nodes processed before detection stopped.
    """
    q = deque([n for n, d in indeg.items() if d == 0])
    topo = []

    indeg_copy = indeg.copy()
    while q:
        u = q.popleft()
        topo.append(u)
        for v in adj.get(u, []):
            indeg_copy[v] -= 1
            if indeg_copy[v] == 0:
                q.append(v)

    is_dag = (len(topo) == len(indeg))
    return is_dag, topo


def find_cycle_dfs(node_ids: set, adj: Dict[str, List[str]]) -> List[str]:
    """
    Find and return one cycle using DFS (returns list of node ids in cycle order) or [] if none found.
    This is a simple approach to detect a back-edge.
    """
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in node_ids}
    parent = {}

    cycle = []

    def dfs(u):
        nonlocal cycle
        color[u] = GRAY
        for v in adj.get(u, []):
            if color.get(v, WHITE) == WHITE:
                parent[v] = u
                if dfs(v):
                    return True
            elif color.get(v) == GRAY:
                # found back-edge v <- u; reconstruct cycle
                # path from v .. u
                path = [v]
                cur = u
                while cur != v and cur in parent:
                    path.append(cur)
                    cur = parent[cur]
                path.append(v)
                path.reverse()
                cycle = path
                return True
        color[u] = BLACK
        return False

    for n in node_ids:
        if color[n] == WHITE:
            parent[n] = None
            if dfs(n):
                break

    return cycle


@app.get("/")
def health():
    return {"status": "ok", "message": "Pipeline parser running"}


@app.post("/pipelines/parse")
def parse_pipeline(payload: PipelinePayload):
    try:
        nodes = payload.nodes or []
        edges = payload.edges or []

        # Build graph representation
        node_ids, adj, indeg = build_graph(nodes, edges)

        num_nodes = len(nodes) if nodes is not None else 0
        num_edges = len(edges) if edges is not None else 0

        # Use Kahn to test DAG and get topo order if DAG
        is_dag, topo = is_dag_kahn(node_ids, adj, indeg)

        result = {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": bool(is_dag),
        }

        # If not DAG, attempt to find a cycle to help UI debugging
        if not is_dag:
            cycle_nodes = find_cycle_dfs(node_ids, adj)
            result["cycle_nodes"] = cycle_nodes

        return result

    except Exception as e:
        # return server error with message
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    # For local debug only (uvicorn recommended)
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
