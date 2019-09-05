import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import common from '@material-ui/core/colors/common';
import { Rnd } from 'react-rnd';

interface DB_tool_input_prop{
    header_data: string[];
    pushDatum: (datum:{[key: string]: string;}) => void;
    textValues: {[key: string]: string;};
    textForcus: string;
    setText: (nextTextValues:{[key: string]: string;}) => void;
    chengeForcus: (target:string) => void;
}

interface DB_tool_input_state{
}

class DB_tool_input extends React.Component<DB_tool_input_prop, DB_tool_input_state> {
    rnd: Rnd;
    private textInputs: {[key: string]: HTMLInputElement;};

    constructor(props:DB_tool_input_prop) {
        super(props);
        this.changeText = this.changeText.bind(this);
        this.onClickDBInputBtn = this.onClickDBInputBtn.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.nextFocus = this.nextFocus.bind(this);
        this.keyPressAction = this.keyPressAction.bind(this);
        this.createTextField = this.createTextField.bind(this);
        this.textInputs = {};
    }

    componentDidMount() {
        this.rnd.updatePosition({x: 10, y: 230})
    }

    render(){
        const style: { [key: string]: string } = {
            position: "fixed",
            zIndex: "2147483647"
        };
        const btn_style: { [key: string]: string } = {
            top:'0',
            textAlign: 'right'
        };
        

        return (
            <Rnd default={{
                x: 0,
                y: 200,
                width: 800,
                height: 160
              }}
              style={style} 
              ref={(rnd: Rnd) => { this.rnd = rnd} }
            >
                <Box component="div" width="100%" height="100%" overflow="auto" bgcolor="background.paper">
                    <Table className='table'>
                        <TableHead>
                        <TableRow>
                            <TableCell style={{
                                backgroundColor: common.black,
                                color: common.white
                            }}>
                                {this.props.header_data[0]}
                            </TableCell>
                            {this.props.header_data.slice(1, this.props.header_data.length).map(colume => (
                                <TableCell align="right" 
                                    style={{
                                    backgroundColor: common.black,
                                    color: common.white
                                }}>{colume}</TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={"TextField"}>
                                {this.props.header_data.map(colume => this.createTextField(colume))}
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div  className='input_btn'>
                        <Button style={btn_style} variant="contained" color="secondary" onClick={this.onClickDBInputBtn}>登録</Button>
                    </div>
                </Box>
            </Rnd>
        );
    }

    private createTextField(colume:string){
        var color = "white";
        if (colume == this.props.textForcus){
            color = "#CCFFFF"
        }
        const textfield_style: { [key: string]: string } = {
            backgroundColor: color
        };
        return (
            <TableCell align="right">
                <TextField  inputRef={(input: HTMLInputElement) => { this.textInputs[colume] = input } } 
                id={colume} type="text" value={this.props.textValues[colume]} 
                    onChange={this.changeText} 
                    onClick={(e:any) => this.setFocus(e)}
                    onKeyDown={(e:any) => this.keyPressAction(e)}
                    InputProps={{
                        style: textfield_style
                    }}
                />
            </TableCell>
        );
    }
    
    private keyPressAction(e:any){
        if (e.key === 'Tab' || (e.key === 'x' && e.ctrlKey)) {
            this.nextFocus()
        }
    }

    private setFocus(e:any){
        console.log(e.target.id)
        this.props.chengeForcus(e.target.id)

        // 他のフィールドをフォーカスしてから戻す
        if(e.target.id == this.props.textForcus){
            var elem:HTMLInputElement;
            for(var i = 0; i < this.props.header_data.length; i++){
                if (this.props.header_data[i] !== this.props.textForcus){
                    elem = this.textInputs[this.props.header_data[i]]
                }
            }
            setTimeout(function(){
                elem.focus();
            },0);
        }else{
            const elem = this.textInputs[this.props.textForcus];
            setTimeout(function(){
                elem.focus();
            },0);
        }
        

        const elem2 = this.textInputs[e.target.id];
        setTimeout(function(){
            elem2.focus();
        },0);
    }

    private nextFocus(){
        var next = 0;
        const current = document.activeElement;
        for(var i = 0; i < this.props.header_data.length; i++){
            if (this.textInputs[this.props.header_data[i]] === current){
                break;
            }
            next = i + 1;
        }
        next = i + 1;
        if(next === this.props.header_data.length){
            next = 0;
        }
        const elem = this.textInputs[this.props.header_data[next]];
        setTimeout(function(){
            elem.focus();
        },0);
      }

    private onClickDBInputBtn(){
        this.props.pushDatum(JSON.parse(JSON.stringify(this.props.textValues)))
        var textValues:{[key: string]: string;} = this.props.textValues;
        for(var i=0; i < this.props.header_data.length; i++){
            textValues[this.props.header_data[i]] = ""
        }
        this.props.setText(textValues);
    }

    private changeText(e:any) {
        var textValues = this.props.textValues;
        textValues[e.target.id] = e.target.value
        this.props.setText(textValues);
    }
}

export default DB_tool_input;