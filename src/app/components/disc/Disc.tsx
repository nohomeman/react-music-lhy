import React,{ Component } from 'react'
import './Disc.scss'
import { CSSTransition } from 'react-transition-group'
import { getSongList } from 'api/recommend.js'
import { connect } from 'react-redux'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/MusicList'
import {createSong} from 'common/js/song.js'
import { withRouter } from 'react-router'

interface DiscBaseStateType{
    showMusicList: boolean,
    songs:Array<any>
}

interface DiscBasePropType{
    disc:any,
    history:any
}


class DiscBase extends Component<DiscBasePropType, DiscBaseStateType>{
    unmoutedFlag:boolean;
    constructor(props:DiscBasePropType){
        super(props)
        this.unmoutedFlag=false
        this.state  = {
            showMusicList: false,
            songs:[]
        }
    }

    back = () => {
        this.setState({
            showMusicList:false
        },() => {this.props.history.goBack()})
    }

    componentDidMount(){
        this.setState({
            showMusicList:true
        })
        this._getSongList()
    }

    componentWillUnmount(){
        this.unmoutedFlag=true
    }

    _getSongList() {
        if (!this.props.disc.dissid) {
            this.props.history.push('/recommend')
            return
        }
        getSongList(this.props.disc.dissid).then((res) => {
            if (res.code === ERR_OK && !this.unmoutedFlag) {
                this.setState({
                    songs:this._normalizeSongs(res.cdlist[0].songlist)
                })
            }
        })
    }

    _normalizeSongs = (list:Array<any>) => {
        let ret:any= []
        list.forEach((item) => {
            let musicData = item
            if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData))
            }
        })
        return ret
    }


    render(){
        const { disc } = this.props;
        const { songs } = this.state;
        return(
            <CSSTransition
                in={this.state.showMusicList}
                timeout={300}
                classNames="message"
                appear={true}
                unmountOnExit
            >
                <MusicList singerName={disc.name} bgImage={disc.imgurl} songs={songs} back={this.back}/>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state:any,ownProps:any) => (
    {
        disc:state.disc,
        ...ownProps
    }
)

const Disc = withRouter(connect(mapStateToProps)(DiscBase));

export default Disc