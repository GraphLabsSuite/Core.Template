import { IGraphActionEdge, IGraphActionVertex } from '../../types/IGraphAction';
export declare const ADD_VERTEX: string;
export declare const REMOVE_VERTEX: string;
export declare const ADD_EDGE: string;
export declare const REMOVE_EDGE: string;
export declare const graphActionsCreators: {
    addVertex(name: string): IGraphActionVertex;
    removeVertex(name: string): IGraphActionVertex;
    addEdge(vertexOne: string, vertexTwo: string): IGraphActionEdge;
    removeEdge(vertexOne: string, vertexTwo: string): IGraphActionEdge;
};
