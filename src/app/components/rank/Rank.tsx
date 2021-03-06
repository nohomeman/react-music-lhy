import React,{ Component } from 'react'
import './Rank.scss'
import Loading from 'reuse/loading/Loading'
import Scroll from 'reuse/scroll/Scroll'
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { Route, withRouter } from 'react-router'
import TopList from 'components/top-list/TopList'
import LazyImage from 'reuse/lazyimg/Lazy-img'
import { connect } from 'react-redux'
import { setTopList } from 'actions/rank'

interface RankStateType{
    topList:any
}

interface RankPropType{
    history:any,
    location:any,
    match:any,
    setTopList:Function
}

class Rank extends Component<RankPropType,RankStateType>{
    unmoutedFlag:boolean;
    toplist:any;
    constructor(props:RankPropType){
        super(props)
        this.unmoutedFlag=false
        this.toplist = React.createRef()
        this.state = {
            topList:[]
        }
    }

    componentDidMount(){
        this._getTopList()
    }

    selectItem = (item:any) => {
        this.props.history.push(`/rank/${item.id}`)
        this.props.setTopList(item)
    }

    _getTopList = () => {
        getTopList().then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    topList:res.data.topList
                })
            }
        })
    }

    render(){
        const { topList } = this.state
        return(
            <div className="rank" ref="rank">
                <Scroll className="toplist" ref={this.toplist}>
                    <ul>
                        {
                            !!topList.length && topList.map((item:any, index:number) =>(
                                <li className="item" key={index} onClick={() => {this.selectItem(item)}}>
                                    <div className="icon">
                                        <LazyImage
                                            className="RankListLazy"
                                            containerClassName="rank"
                                            sizes="200px"
                                            src="https://placehold.it/200x300?text=Image1"
                                            srcset={item.picUrl}
                                            width="100"
                                            height="100"
                                        />
                                    </div>
                                    <ul className="songlist">
                                        {
                                            item.songList && item.songList.map((song:any, index:number) => (
                                                <li className="song" key={index}>
                                                    <span>{index + 1}</span>
                                                    <span>{song.songname}-{song.singername}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        !topList.length &&
                        <div className="loading-container">
                            <Loading/>
                        </div>
                    }
                </Scroll>
                <Route path="/rank/:id" component={TopList}/>
            </div>
        )
    }
}

const mapStateToProps = (state:any,ownProps:any) => ({
    ...ownProps
})

const mapDispatchToProps = (dispatch:any) => {
    return {
        setTopList : (topList:any) => {
            dispatch(setTopList(topList))
        }
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Rank))