import * as React from 'react';
import { addAction, addPlainAction, IStudentAction } from 'graphlabs.core.notifier';
import { ToolButton } from '../ToolButton';
import { store } from '../..';
import { Component } from 'react';
import {appActionCreators as actions } from '../../redux/app/actions';
import Tooltip from '../Tooltip';
import styles from './ToolButtonList.module.css';
import {adapter} from "../..";

const taskId = 1; // TODO: get it from somewhere
const sessionGuid = 'uuid'; // TODO: get it from somewhere

interface State {
    show: boolean;
}

// Default server URL (mostly useful while development)
let serverUrl: string = "http://gl-backend.svtz.ru:5000";
if ("REACT_APP_SERVER_PROTOCOL" in process.env && "REACT_APP_SERVER_HOST" in process.env && "REACT_APP_SERVER_PORT" in process.env) {
    serverUrl = process.env.REACT_APP_SERVER_PROTOCOL + '://' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT;
}

export class ToolButtonList extends Component<{}, State> {

    public toolButtons?: {
        [index: string]: () => void;
    };

    private bound!: HTMLDivElement|null;

    constructor(props: {}) {
        super(props);
        this.state = {
            show: false,
        };
        this.hide = this.hide.bind(this);
    }

    public render() {
        return this.getList();
    }

    public help(): string {
        return 'Test help example';
    }

    public beforeComplete(): Promise<any> {
        return Promise.resolve({success: true, fee: 0});
    }

    private dispatch(payload: IStudentAction): void {
        if (process.env.NODE_ENV === 'production') {
            addAction(payload).then(res => store.dispatch(res));
        } else {
            store.dispatch(addPlainAction(payload));
        }
        return void 0;
    }

    private hide() {
        this.setState({
            show: false,
        });
    }

    private setGraphCreationList() {
        const setImg = (title: string): string =>
            `${serverUrl}/odata/downloadImage(name='${title}.png')`;
        let list: { [index: string]: () => void } = {};
        list[setImg('add_vertex')] = () => {
            console.log(adapter);
            adapter.addVertex();
        };
        list[setImg('add_edge')] = () => {
            adapter.addEdge();
        };
        list[setImg('remove_vertex')] = () => {
            adapter.removeVertex();
        };
        list[setImg('remove_edge')] = () => {
            adapter.removeEdge();
        };
        return list;
    }

    private setDefaultButtonList() {
        const setImg = (title: string): string =>
            `${serverUrl}/odata/downloadImage(name='${title}.png')`;
        let list: { [index: string]: () => void } = {};
        list[setImg('Help')] = () => {
            this.dispatch({
                message: 'Help required',
                variantId: taskId,
                isTaskFinished: false,
                fee: 0,
                datetime: Date.now(),
            });
            this.setState({
                show: true,
            });
        };
        list[setImg('Complete')] = () => {
            this.beforeComplete().then(res => {
                this.dispatch({
                    message: `Task is done (${res.fee})`,
                    variantId: taskId,
                    isTaskFinished: false,
                    fee: res.fee,
                    datetime: Date.now(),
                });
                if (res.success) {
                    this.dispatch({
                        message: 'Task is checked',
                        variantId: taskId,
                        isTaskFinished: true,
                        fee: res.fee,
                        datetime: Date.now(),
                    });
                    store.dispatch(actions.setStatus(true));
                }
            });
        };
        return list;
    }

    private getList() {
        const result = [];
        const defaultList = this.setDefaultButtonList();
        const graphCreationList = this.setGraphCreationList();
        for (const key in defaultList) {
            if (defaultList.hasOwnProperty(key)) {
                result.push(<div key={key}><ToolButton path={key} listener={defaultList[key]}/></div>);
            }
        }
        if(window.sessionStorage.getItem("adapterType") == "writable") {
            for (const key in graphCreationList) { //надо поставить условие!!!
                if (graphCreationList.hasOwnProperty(key)) {
                    result.push(<div key={key}><ToolButton path={key} listener={graphCreationList[key]}/></div>);
                }
            }
        }
        if (this.toolButtons) {
            for (const key in this.toolButtons) {
                if (this.toolButtons.hasOwnProperty(key)) {
                    result.push(<ToolButton key={key} path={key} listener={this.toolButtons[key]}/>);
                }
            }
        }
        return (
            <div
                ref={i => {this.bound = i}}
            >
                <Tooltip value={this.help()} show={this.state.show} bound={this.bound} showTooltip={this.hide}/>
                <div className={styles.ButtonList}>{result}</div>
            </div>
        );
    }
}
