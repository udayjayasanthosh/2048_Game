import React, { useState, useEffect, useRef } from "react";
import './game_page.css';
import { VscDebugRestart } from "react-icons/vsc";
import { ImUndo2 } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import { AiFillSound, AiOutlineSound } from "react-icons/ai";

function Game() {
    const backgroundAudio = useRef(null);
    const soundEffect = useRef(null);

    const [orgArr, setOrgArr] = useState(Array(4).fill(0).map(() => Array(4).fill(0)));
    const [dupArr, setdupArr] = useState(Array(4).fill(0).map(() => Array(4).fill(0)));
    const [highScore, sethighScore] = useState(0);
    const [score, setScore] = useState(0);
    const [music, setMusic] = useState(false);
    const [sound, setSound] = useState(false);
    const [musicOption, setMusicOption] = useState(false);
    const [tileAnimation, setTileAnimation] = useState({});

    const elements = [2, 2, 2, 4];

    useEffect(() => {
        const savedScore = localStorage.getItem("high_score");
        if (savedScore) sethighScore(Number(savedScore));
        restart();
    }, []);

    useEffect(() => {
        localStorage.setItem("high_score", highScore);
    }, [highScore]);

    useEffect(() => {
        if (!backgroundAudio.current) return;
        if (music) {
            backgroundAudio.current.loop = true;
            backgroundAudio.current.play().catch(() => { });
        } else {
            backgroundAudio.current.pause();
            backgroundAudio.current.currentTime = 0;
        }
    }, [music]);

    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30) right();
                else if (deltaX < -30) left();
            } else {
                if (deltaY > 30) down();
                else if (deltaY < -30) up();
            }
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [orgArr]);


    function playSound() {
        if (sound && soundEffect.current) {
            soundEffect.current.currentTime = 0;
            soundEffect.current.play();
        }
    }

    useEffect(() => {
        let hasMoves = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (orgArr[i][j] === 0 ||
                    (i < 3 && orgArr[i][j] === orgArr[i + 1][j]) ||
                    (j < 3 && orgArr[i][j] === orgArr[i][j + 1])) {
                    hasMoves = true;
                    break;
                }
            }
            if (hasMoves) break;
        }
        if (!hasMoves) document.getElementById("gameover").style.display = "flex";
    }, [orgArr]);

    useEffect(() => {
        const handler = (ev) => {
            const key = ev.key;
            if (key === "ArrowUp") up();
            else if (key === "ArrowDown") down();
            else if (key === "ArrowLeft") left();
            else if (key === "ArrowRight") right();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [orgArr]);

    const restart = () => {
        let arr = Array(4).fill(0).map(() => Array(4).fill(0));
        randomTile(arr);
        setScore(0);
    };

    const undo = () => {
        const nonZeroTiles = dupArr.flat().filter(v => v !== 0).length;
        if (nonZeroTiles <= 1) return;
        setOrgArr(dupArr.map(row => [...row]));
    };

    const randomTile = (arr) => {
        let empty = [];
        arr.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 0) empty.push([i, j]);
            });
        });
        if (empty.length > 0) {
            const [i, j] = empty[Math.floor(Math.random() * empty.length)];
            arr[i][j] = Math.random() < 0.9 ? 2 : 4;
            setTileAnimation({ [`${i}-${j}`]: "pop" });
            setTimeout(() => setTileAnimation({}), 300);
            setOrgArr(arr.map(row => [...row]));
        }
    };

    const move = (direction) => {
        playSound();
        const arr = orgArr.map(row => [...row]);
        setdupArr(orgArr.map(row => [...row]));
        let moved = false;
        let currentScore = 0;

        const combine = (line) => {
            let newLine = line.filter(v => v !== 0);
            for (let i = 0; i < newLine.length - 1; i++) {
                if (newLine[i] === newLine[i + 1]) {
                    newLine[i] *= 2;
                    newLine[i + 1] = 0;
                    currentScore += newLine[i];
                }
            }
            return newLine.filter(v => v !== 0).concat(Array(4).fill(0)).slice(0, 4);
        };

        for (let i = 0; i < 4; i++) {
            let originalLine = [];
            let newLine = [];
            switch (direction) {
                case "left":
                    originalLine = arr[i];
                    newLine = combine(originalLine);
                    arr[i] = newLine;
                    break;
                case "right":
                    originalLine = arr[i].slice().reverse();
                    newLine = combine(originalLine).reverse();
                    arr[i] = newLine;
                    break;
                case "up":
                    originalLine = arr.map(row => row[i]);
                    newLine = combine(originalLine);
                    for (let j = 0; j < 4; j++) arr[j][i] = newLine[j];
                    break;
                case "down":
                    originalLine = arr.map(row => row[i]).reverse();
                    newLine = combine(originalLine).reverse();
                    for (let j = 0; j < 4; j++) arr[j][i] = newLine[j];
                    break;
                default:
                    break;
            }
            if (JSON.stringify(originalLine) !== JSON.stringify(newLine)) moved = true;
        }

        if (moved) {
            setScore(prev => prev + currentScore);
            if (score + currentScore > highScore) sethighScore(score + currentScore);
            randomTile(arr);
        }
    };

    const up = () => move("up");
    const down = () => move("down");
    const left = () => move("left");
    const right = () => move("right");

    const close = () => {
        setScore(0);
        restart();
        document.getElementById("gameover").style.display = "none";
    };

    return (
        <>
            <audio ref={backgroundAudio} src="background_music.mp3" />
            <audio ref={soundEffect} src="music.mp3" />

            <div id="main">
                <div id="main_header"><div id="logo2048">2048</div></div>

                <div id="main_body">
                    <div id="score_board">
                        <div id="high-score"><div id="header">HIGH SCORE</div><div id="score">{highScore}</div></div>
                        <div id="high-score"><div id="header">SCORE</div><div id="score">{score}</div></div>
                    </div>

                    <div id="board">
                        {orgArr.map((row, i) => (
                            <div className="row" key={i}>
                                {row.map((cell, j) => (
                                    <div
                                        className={`cell id_${cell} ${tileAnimation[`${i}-${j}`] || ''}`.trim()}
                                        key={`${i}-${j}`}
                                    >
                                        {cell !== 0 ? cell : ''}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div id="gameover" className="shake">
                        <div id="game_over_message">GAME OVER !!</div>
                        <div id="game_over_restart" onClick={close}><VscDebugRestart /></div>
                    </div>

                    <div id="options">
                        <div id="restart" onClick={restart}><VscDebugRestart /></div>
                        <div id="undo" onClick={undo}><ImUndo2 /></div>
                        <div id="settings" onClick={() => setMusicOption(prev => !prev)}>
                            <IoIosSettings />
                            <div id="music" style={{ display: musicOption ? "flex" : "none" }}>
                                <div onClick={() => setMusic(mu => !mu)}>
                                    {music ? <MdMusicNote /> : <MdMusicOff />}
                                </div>
                                <div onClick={() => setSound(mu => !mu)}>
                                    {sound ? <AiFillSound /> : <AiOutlineSound />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
