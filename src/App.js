import React, { Component } from 'react';
import './App.css';
import jsonp from 'jsonp';
import classnames from 'classnames';

class App extends Component {
  constructor(){
    super();
    this.state = {
      val: '',
      word: '',
      words: [],
      index: -1,
      curIndex: -1,
      isShowAc: false,
      isFocusAc: false
    }
  }

  handleClickInput = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  handleChange = (e) => {
    let val = e.target.value;
    let word = e.target.value;
    let url = `https://sug.so.360.cn/suggest?encodein=utf-8&encodeout=utf-8&format=json&fields=word&word=${val}`;
    this.setState({
      val,
      word
    },()=>{
      jsonp(url,{
        param: 'callback'
      },(err,data)=>{
        //console.log(data)
        this.setState({
          index: -1,
          curIndex: -1,
          words: data.result ? data.result : [],
          isShowAc: data.result && data.result.length ? true : false,
          isFocusAc: true
        })
      });
    });
  }

  handleFocus = () => {
    this.setState({
      isShowAc: !!this.state.words.length,
      isFocusAc: true
    });
  }

  handleKeyDown = (e) => {
    let index;
    if(e.keyCode === 13){
      this.handleSearch();
      return false;
    }
    if(e.keyCode === 38){
      index = this.state.index-1;
      this.updateVal(index);
    }
    if(e.keyCode === 40){
      index = this.state.index+1;
      this.updateVal(index);
    }
  }

  updateVal = (index) => {
    let {words} = this.state;
    let val;
    if(index <= -2){
      index = words.length-1;
    }
    if(index >= words.length){
      index = -1;
    }
    if(index === -1 || index === words.length){
      val = this.state.word;
    }else{
      val = words[index].word;
    }
    this.setState({
      val,
      index,
      curIndex: index
    });
  }

  handleMouseEnter = (e) => {
    let curIndex = parseInt(e.target.getAttribute('ac_index'));
    this.setState({
      curIndex
    });
  }

  handleMouseLeave = (e) => {
    let curIndex = this.state.index;
    this.setState({
      curIndex
    });
  }

  handleSelect = (e) => {
    let val = e.target.innerText;
    let curIndex = parseInt(e.target.getAttribute('ac_index'));
    this.setState({
      val,
      index: curIndex,
      curIndex
    },()=>{
      this.handleSearch();
    });
  }

  handleSearch = () => {
    let val = this.state.val;
    val = val.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
    if(val !== '') window.location = `https://www.so.com/s?q=${val}`
  }

  componentDidMount(){
    document.addEventListener('click',()=>{
      this.setState({
        isShowAc: false,
        isFocusAc: false
      });
    },false);
  }

  render() {
    return (
      <div className="page-wrap skin-page-wrap">
        <div id="main">
          <div id="bd_logo" className="anime">
            <h1 className="skin-logo pngfix">360搜索</h1>
          </div>
          <div id="bd_search">
            <div className="fixed">
                <div id="input-container" className={this.state.isFocusAc ? 'focus' : ''}>

                  <div className={ classnames('ac_wrap',{'active':this.state.isShowAc}) }>
                    <div unselectable="on" className="ac_wrap_inner">
                      <div unselectable="on" className="ac_menu_ctn">
                        <ul unselectable="on" className="ac_menu">
                          {
                            this.state.words.map((item,index) => {
                              return <li
                                        ref=""
                                        key={index}
                                        ac_index={index}
                                        onMouseEnter={this.handleMouseEnter}
                                        onMouseLeave={this.handleMouseLeave}
                                        onClick={this.handleSelect}
                                        className={ classnames({'selected':this.state.curIndex === index,'hover':this.state.index === index}) }
                                      >
                                        {item.word}
                                      </li>
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>


                  <div id="suggest-align" className={ classnames('skin-search-input',{'hover':this.state.isFocusAc}) }>
                    <input
                      onClick={this.handleClickInput}
                      onKeyDown={this.handleKeyDown}
                      onFocus={this.handleFocus}
                      onChange={this.handleChange}
                      value={this.state.val}
                      type="text"
                      className="placeholder"
                      id="input"
                    />
                  </div>
                  <button onClick={this.handleSearch} type="button" id="search-button" className="skin-search-button">搜索</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
