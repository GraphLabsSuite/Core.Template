import * as React from 'react';
import { select } from 'd3-selection';
import * as d3 from 'd3';

import { RootState, store, IGraphView } from '..';
import { GraphSerializer, IEdge, IGraph, IVertex } from 'graphlabs.core.graphs';
import { CircleGraphVisualizer } from 'graphlabs.core.visualizer';

import { graphSerializer } from '../utils/serializers';
import { Component } from 'react';

export interface CGAProps {
    className?: string;
}

export interface State {
    events: Event[];
}

export class CommonGraphAdapter extends Component<CGAProps, State> {

    public ref!: SVGSVGElement;
    public graphVisualizer!: CircleGraphVisualizer;

    private _graph!: IGraphView;
    get graph(): IGraphView {
        const state: RootState = store.getState();
        store.subscribe(() => {
            if (this.graph !== store.getState().graph) {
                this._graph = store.getState().graph;
                this.forceUpdate();
            }
        });
        this._graph = {...state.graph};
        return this._graph;
    }

    protected clickEdge() {
        // tslint:disable-next-line no-console
        console.log('Edge clicked!');
    }

    protected clickVertex() {
        // tslint:disable-next-line no-console
        console.log('Vertex clicked!');
    }

    renderSvg() {
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.edges) {
            const data = [{x: elem.outPoint.X, y: elem.outPoint.Y}, {x: elem.inPoint.X, y: elem.inPoint.Y}];
            select(this.ref)
                .append('line')
                .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr('out', elem.edge.vertexOne.name)
                .attr('in', elem.edge.vertexTwo.name)
                .attr('x1', data[0].x)
                .attr('x2', data[1].x)
                .attr('y1', data[0].y)
                .attr('y2', data[1].y)
                .style('stroke', 'black')
                .style('stroke-width', 5)
                .style('fill', 'none')
                .on('click', this.clickEdge.bind(this));
        }

        for (const elem of this.graphVisualizer.geometric.vertices) {
            select<SVGSVGElement, {}>(this.ref)
                .append('circle')
                .attr('id', `vertex_${elem.label}`)
                .attr('cx', elem.center.X)
                .attr('cy', elem.center.Y)
                .attr('r', elem.radius)
                .style('fill', '#eee')
                .style('stroke', '#000')
                .style('stroke-width', 5)
                .classed('dragging', true)
                .call(d3.drag<SVGCircleElement, {}>().on('start', startDrag))
                .on('click', this.clickVertex.bind(this));
            select(this.ref)
                .append('text')
                .attr('id', `label_${elem.label}`)
                .attr('x', elem.center.X)
                .attr('y', elem.center.Y + elem.radius / 4)
                .attr('font-size', elem.radius)
                .text(elem.label)
                .style('fill', '#000')
                .style('font-family', 'sans-serif')
                .style('text-anchor', 'middle')
                .style('padding-top', '50%')
                .style('user-select', 'none')
                .style('pointer-events', 'none');
        }
        const referrer = this.ref;
        function startDrag(this: SVGCircleElement) {
            const circle = d3.select(this).classed('dragging', true);
            d3.event.on('drag', dragged).on('end', ended);
            const radius = parseFloat(circle.attr('r'));
            function dragged(d: any) {
                if (d3.event.x < referrer.getBoundingClientRect().width - radius
                    && d3.event.x > radius
                    && d3.event.y < referrer.getBoundingClientRect().height - radius
                    && d3.event.y > radius) {
                circle.raise().attr('cx', d3.event.x).attr('cy', d3.event.y);
                const name = circle.attr('id');
                const _id = name.substring(7);
                select(`#label_${_id}`)
                    .raise()
                    .attr('x', d3.event.x)
                    .attr('y', d3.event.y + +circle.attr('r') / 4);
                d3.selectAll('line').each(function (l: any, li: any) {
                    if (`vertex_${d3.select(this).attr('out')}` === name) {
                        select(this)
                            .attr('x1', d3.event.x)
                            .attr('y1', d3.event.y);
                    }
                    if (`vertex_${d3.select(this).attr('in')}` === name) {
                        select(this)
                            .attr('x2', d3.event.x)
                            .attr('y2', d3.event.y);
                    }
                });
                }
                //     console.log("ATTENTION!!!");
                // }
            }

            function ended() {
                circle.classed('dragging', false);
            }
        }
    }

    updateSvg() {
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.vertices) {
            select(`#vertex_${elem.label}`)
                .attr('cx', elem.center.X)
                .attr('cy', elem.center.Y)
                .attr('fill', 'black')
                .attr('r', elem.radius);
            select(`#label_${elem.label}`)
                .attr('x', elem.center.X)
                .attr('y', elem.center.Y + elem.radius / 4)
                .attr('font-size', elem.radius);
        }

        for (const elem of this.graphVisualizer.geometric.edges) {
            select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr('x1', elem.outPoint.X)
                .attr('x2', elem.inPoint.X)
                .attr('y1', elem.outPoint.Y)
                .attr('y2', elem.inPoint.Y);
        }
    }

    componentDidMount() {
        const graphInString: string = graphSerializer(this.graph);
        const graph: IGraph<IVertex, IEdge> = GraphSerializer.deserialize(graphInString);
        this.graphVisualizer = new CircleGraphVisualizer(graph);
        this.renderSvg();
        window.onresize = this.updateSvg.bind(this);
    }

    constructor(props: CGAProps) {
        super(props);
        this.state = {
            events: []
        };
        this.updateGraph = this.updateGraph.bind(this);
    }

    updateGraph() {
        // tslint:disable-next-line no-console
        console.log('Here I am!');
    }

    render() {
        return (
                <svg
                    style={{width: '100%', height: '100%'}}
                    ref={(ref: SVGSVGElement) => this.ref = ref}
                />);
    }
}
