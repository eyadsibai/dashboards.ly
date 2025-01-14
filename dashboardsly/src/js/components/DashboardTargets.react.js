'use strict';

import React from 'react';
var DropTarget = require('react-dnd').DropTarget;
import AppActions from '../actions/AppActions';
import {AppStore} from '../stores/AppStore';
import {DashboardPlotBlock} from './DashboardPlotBlock.react';
import ComponentTypes from '../constants/ComponentTypes';

var Row = React.createClass({
    propTypes: {
        isOver: React.PropTypes.bool.isRequired,
        canDrop: React.PropTypes.bool.isRequired,
        plots: React.PropTypes.array.isRequired,
        rowNumber: React.PropTypes.number.isRequired,
        canRearrange: React.PropTypes.bool.isRequired
    },

    gridColumnWidth: function (n) {
        let padding=0.5;
        return (100-padding*(n-1))/n + '%';
    },

    render: function () {
        let connectDropTarget = this.props.connectDropTarget;
        let isOver = this.props.isOver;
        let canDrop = this.props.canDrop;
        let rowStyle={};
        if(!isOver && canDrop){
            rowStyle.border = 'thin dashed rgb(174, 163, 255)';
        }
        let columns = [];
        for(var i=0; i<this.props.plots.length; i++) {
            columns.push(
                <div key={i} style={{width: this.gridColumnWidth(this.props.plots.length)}} className="columns">
                    <DashboardPlotBlock plot_url={this.props.plots[i].plot_url} canRearrange={this.props.canRearrange}/>
                </div>)
        }
        return connectDropTarget(<div style={rowStyle} className="row">{columns}</div>);
    }
});

var NewRowTarget = React.createClass({
    propTypes: {
        isOver: React.PropTypes.bool.isRequired,
        canDrop: React.PropTypes.bool.isRequired
    },
    render: function(){
        let style={
            'backgroundColor': 'rgb(227, 236, 249)',
            'width': '100%',
            'height': '50px',
            'border': 'thin dashed rgb(174, 163, 255)',
            'textAlign': 'center',
            'color': '#555555',
            'fontSize': '14px',
            'lineHeight': '50px',
            'fontWeight': 400,
            'marginLeft': '-1px',
            'marginRight': '-1px',
            'letterSpacing': '0.1rem',
            'textTransform': 'uppercase',
            'fontWeight': 500
        };
        let content = 'drag plots here to create a new row'

        return this.props.connectDropTarget(<div style={style} className="row">{content}</div>);
    }
});

var newRowTargetSpec = {
    hover: function(props, monitor) {
        AppActions.appendPlotToDashboard(monitor.getItem().id);
    },
    drop: function(props, monitor) {
        AppActions.appendPlotToDashboard(monitor.getItem().id);
    }
};

var panelTargetSpec = {
    hover: function(props, monitor) {
        let targetRowNumber = props.rowNumber
        let plot_url = monitor.getItem().id;
        AppActions.movePlotToNewRow(plot_url, targetRowNumber);
    },

    drop: function(props, monitor) {
        let targetRowNumber = props.rowNumber
        let plot_url = monitor.getItem().id;
        AppActions.movePlotToNewRow(plot_url, targetRowNumber);
    },

    canDrop: function(props, monitor) {
        // Can't drop on our own row
        let rows = AppStore.getState().rows;
        let plot_url = monitor.getItem().id;
        for(let i=0; i<rows.length; i++) {
            for(let j=0; j<rows[i].length; j++){
                if(rows[i][j].plot_url === plot_url && i === props.rowNumber) {
                    return false;
                }
            }
        }
        return true;
    }
}

function panelCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

exports.NewRowTarget = DropTarget(ComponentTypes.DRAGGABLE_PLOT_BLOCK, newRowTargetSpec, panelCollect)(NewRowTarget);
exports.Row = DropTarget(ComponentTypes.DRAGGABLE_PLOT_BLOCK, panelTargetSpec, panelCollect)(Row);
