import React from "react";
import { useState,useEffect,useRef } from "react";
import './game_page.css'
import { VscDebugRestart } from "react-icons/vsc";
import { ImUndo2 } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { MdMusicNote } from "react-icons/md";
import { MdMusicOff } from "react-icons/md";
import { AiFillSound } from "react-icons/ai";
import { AiOutlineSound } from "react-icons/ai";
function Game()
{
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const [orgArr,setOrgArr]=useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
    const [dupArr,setdupArr]=useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    const [highScore,sethighScore]=useState(0);
    const [Score,setScore]=useState(0);
    const elements=[2,4,2,2];
    const [music,setmusic]=useState(false);
    const [sound,setsound]=useState(false);
    const [music_option,setmusic_option]=useState(false);
    useEffect(() => {
        const audio=document.getElementById("audio");
        if(!audio) return;
        if (music) {
          audio.loop = true;
          audio.play().catch((error) => console.log("Autoplay blocked:", error));
        } else {
          audio.pause(); 
          audio.currentTime = 0; 
        }
      }, [music]);
    function sound_operation()
    {
        if(sound)
        {
        const a=document.getElementById("music")
        if(a)
        {
            a.currentTime=0;
            a.play();
        }
        }
    }
    useEffect(()=>{
        if(Score>highScore)
        {
            sethighScore(Score);
        }
    },[Score])
    useEffect(()=>{
        restart()
        var a=localStorage.getItem('high_score')
        if(a)
        sethighScore(a)
    },[])
    useEffect(()=>{
        var empty=0;
        for(let i=0;i<4;i++)
        {
            for(let j=0;j<4;j++)
            {
                if(orgArr[i][j]==0)
                {
                    empty+=1;
                    break;
                }
                else
                {
                    if(i+1<4 && orgArr[i+1][j]==orgArr[i][j])
                    {
                        empty+=1;
                        break;
                    }
                    if(i-1>=0 && orgArr[i-1][j]==orgArr[i][j])
                    {
                        empty+=1;
                        break;
                    }
                    if(j+1<4 && orgArr[i][j+1]==orgArr[i][j] )
                    {
                        empty+=1;
                        break;
                    }
                    if(j-1>=4 && orgArr[i][j-1]==orgArr[i][j] )
                    {
                        empty+=1;
                        break;
                    }
                }
            }
            if(empty>0)
            {
                break;
            }
        }
        if(empty==0)
        {
            // alert("game over");
            open();
        }
    },[orgArr])
    useEffect(() => {
        window.addEventListener("keydown",keys);
        return () => {
            window.removeEventListener("keydown",keys);
        };
    }, [orgArr]);
    function undo()
    {
        let count=0;
        for(let i=0;i<4;i++)
        {
            for(let j=0;j<4;j++)
            {
                if(orgArr[i][j]!=0)
                {
                    count+=1;
                }
            }
        }
        if(count>1)
        {
            console.log(dupArr)
        setOrgArr([...dupArr]);
        }
    }
    function restart()
    {
        var arr=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        rand(arr);
        setScore(0);
    }
    function rand(arr)
    {
        var index=0;
        var empty=[];
        for(let i=0;i<4;i++)
        {
            for(let j=0;j<4;j++)
            {
                index+=1;
                if(arr[i][j]==0)
                {
                    empty.push(index);
                }
            }
        }
        var len=empty.length;
        if(len>0)
        {
            var ind=Math.floor(Math.random() * (len))
            var ele=Math.floor(Math.random()*(4))
            index=0;
            for(let i=0;i<4;i++)
            {
                for(let j=0;j<4;j++)
                {   
                    index+=1;
                    if(index==empty[ind])
                    {
                        arr[i][j]=elements[ele]
                        break;
                    }
                }
            }
            setOrgArr([...arr]);
        }
    }
    function right()
    {
        sound_operation();
        var arr=[...orgArr];
        var score=0;
        setdupArr([...orgArr]);
        for(let i=0;i<4;i++)
        {
            var b=[...arr[i]];
            var c=b[3];
            var k=3;
            for(let j=2;j>=0;j--)
            {
                if(c==b[j])
                {
                    b[j]*=2;
                    b[k]=0;
                    if(j-1>=0)
                    {
                        k=j-1;
                        c=b[j-1];
                        j-=1;
                    }
                }
                else if(b[j]!=0)
                {
                    k=j;
                    c=b[j];
                }
            }
            for(let x=3;x>0;x--)
            {
                if(b[x]==0)
                {
                    for(let y=x-1;y>=0;y--)
                    {
                        if(b[y]>0)
                        {
                            b[x]=b[y];
                            b[y]=0;
                            break;
                        }
                    }
                }
            }
            for(let j=0;j<4;j++)
            {
                score+=Math.abs(b[j]-arr[i][j]);
            }
            arr[i]=[...b];
        }
        setScore((s)=>s+score);
        rand(arr)
    }
    function left()
    {
        sound_operation();
        setdupArr([...orgArr]);
        var arr=[...orgArr];
        var score=0;
        for(let i=0;i<4;i++)
        {
            var b=[...arr[i]];
            var k=0;
            var c=b[0];
            for(let j=1;j<4;j++)
            {
                if(c==b[j])
                {
                    b[j]*=2;
                    b[k]=0;
                    if(j+1<4)
                    {
                        k=j+1;
                        c=b[k];
                        j+=1;
                    }
                }
                else if(b[j]!=0)
                {
                    k=j;
                    c=b[k];
                }
            }
            for(let x=0;x<4;x++)
            {
                if(b[x]==0)
                {
                    for(let y=x+1;y<4;y++)
                    {
                        if(b[y]>0)
                        {
                            b[x]=b[y];
                            b[y]=0;
                            break;
                        }
                    }
                }
            }
            for(let j=0;j<4;j++)
            {
                score+=Math.abs(arr[i][j]-b[j]);
            }
            arr[i]=[...b];
        }
        rand(arr);
        setScore((s)=>s+score);
    }
    function up()
    {
        sound_operation();
        // setdupArr([...orgArr]);
        setdupArr(orgArr.map(row => [...row]));
        var arr=[...orgArr];
        var score=0;
        for(let i=0;i<4;i++)
        {
            var b=[];
            for(let j=0;j<4;j++)
            {
                b.push(arr[j][i]);
            }
            var c=b[0];
            var k=0;
            for(let j=1;j<4;j++)
            {
                if(c==b[j])
                {
                    b[j]*=2;
                    b[k]=0;
                    if(j+1<4)
                    {
                        c=b[j+1];
                        k=j+1;
                        j+=1;
                    }
                }
                else if(b[j]!=0)
                {
                    k=j;
                    c=b[j];
                }
            }
            for(let x=0;x<4;x++)
            {
                if(b[x]==0)
                {
                    for(let y=x+1;y<4;y++)
                    {
                        if(b[y]>0)
                        {
                            b[x]=b[y];
                            b[y]=0;
                            break;
                        }
                    }
                }
            }
            for(let j=0;j<4;j++)
            {
                score+=Math.abs(arr[j][i]-b[j]);
                arr[j][i]=b[j];

            }
        }
        rand(arr)
        setScore((s)=>s+score);
    }
    function down()
    {
        sound_operation();
        // setdupArr([...orgArr]);
        setdupArr(orgArr.map(row => [...row]));

        var arr=[...orgArr];
        var score=0;
        for(let i=0;i<4;i++)
        {
            var b=[];
            for(let j=0;j<4;j++)
            {
                b.push(arr[j][i]);
            }
            var k=3;
            var c=b[k];
            for(let j=2;j>=0;j--)
            {
                if(c==b[j])
                {
                    b[j]*=2;
                    b[k]=0;
                    if(j-1>=0)
                    {
                        k=j-1;
                        c=b[k];
                        j-=1;
                    }
                }
                else if(b[j]!=0)
                {
                    k=j;
                    c=b[j];
                }
            }
            for(let x=3;x>0;x--)
            {
                if(b[x]==0)
                {
                    for(let y=x-1;y>=0;y--)
                    {
                        if(b[y]!=0)
                        {
                            b[x]=b[y];
                            b[y]=0;
                            break;
                        }
                    }
                }
            }
            for(let j=0;j<4;j++)
            {
                score+=Math.abs(arr[j][i]-b[j]);
                arr[j][i]=b[j];

            }
        }
        rand(arr);
        setScore((s)=>s+score);
    }
    function keys(ev)
    {
        const key=ev["key"];
        // console.log(key)
        if(key=="ArrowUp")
        {
            up();
        }
        else if(key=="ArrowDown")
        {
            down();

        }
        else if(key=="ArrowRight")
        {
            right();
        }
        else if(key=="ArrowLeft")
        {
            left();
        }
    }
    function close()
    {
        setScore(0);
        restart();
        document.getElementById("gameover").style.display="none";
        localStorage.setItem('high_score',highScore);
    }
    function open()
    {
        document.getElementById("gameover").style.display="flex";
    }
    useEffect(() => {
        const preventPullToRefresh = (e) => {
            if (e.touches && e.touches.length > 0 && e.touches[0].clientY < window.scrollY + 50) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventPullToRefresh, { passive: false });

        return () => {
            document.removeEventListener("touchmove", preventPullToRefresh);
        };
    }, []);
    const handleTouchStart = (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        detectSwipeDirection();
    };
    const handleTouchMove = (event) => {
        const moveY = event.touches[0].clientY;
        if (moveY > touchStartY) {
            // Prevents pull-to-refresh behavior
            event.preventDefault();
        }
    };

    const detectSwipeDirection = () => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 50) {
                right();
            } else if (deltaX < -50) {
                left();
            }
        } else {
            if (deltaY > 50) {
               down();
            } else if (deltaY < -50) {
                up();
            }
        }
    };
    return(
        <>
            <audio id="audio" src="background_music.mp3" />
            <audio id="music" src="music.mp3"/>
            <div id="main">
                <div id="main_header">
                <div id="logo2048">2048</div>
                </div>
                <div id="main_body" onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
                    <div id="score_board">
                        <div id="high-score">
                            <div id="header">
                                HIGH SCORE
                            </div>
                            <div id="score">{highScore}</div>
                        </div>
                        <div id="high-score">
                            <div id="header">
                                 SCORE
                            </div>
                            <div id="score">{Score}</div>
                        </div>
                    </div>
                    <div id="board">
                        {
                           orgArr.map((row, rowIndex) => {
                            return (
                                <div className="row" key={rowIndex}>
                                    {
                                        row.map((cell, cellIndex) => {

                                            return (
                                                <div 
                                                    className="cell"
                                                    id={`id_${cell}`}
                                                >
                                                    {cell}
                                                    {/* 2048 */}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                        }
                    </div>
                    <div id="gameover">
                            <div id="game_over_message">
                                GAME OVER !!
                            </div>
                            <div id="game_over_restart" onClick={()=>{close()}}>
                                <VscDebugRestart />
                            </div>
                    </div>
                    <div id="options">
                        <div id="restart" onClick={()=>{restart()}}>
                            <VscDebugRestart />
                        </div>
                        <div id="undo" onClick={()=>{undo()}}>
                            <ImUndo2 />
                        </div>
                        <div id="undo" onClick={()=>setmusic_option(bool=>!bool)}>
                            <IoIosSettings />
                            <div id="music" style={{display: music_option ? "flex" : "none" }} >
                                <div style={{userSelect:"none"}} onClick={()=>{setmusic((mu)=>!mu)}}><div style={{display:music ? "flex" : "none"}}><MdMusicNote  /></div><div style={{display:music ? "none" : "flex"}}> <MdMusicOff /> </div></div>
                                <div style={{userSelect:"none"}} onClick={()=>{setsound((mu)=>!mu)}}><div style={{display:sound ? "flex" : "none"}}><AiFillSound /></div><div style={{display:sound ? "none" : "flex"}}> <AiOutlineSound /> </div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game;