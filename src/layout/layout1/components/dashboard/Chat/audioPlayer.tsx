import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import WaveSurfer from 'wavesurfer.js'
// import CursorPlugin from 'wavesurfer.js/src/plugin/cursor'

const AudioPlayer = (props: any) => {
    const { audio, player } = props;
    
    const containerRef: any = useRef();
    const waveSurferRef: any = useRef(null);
    const [isPlaying, toggleIsPlaying] = useState(false);
    const [currentState, setCurrentState] = useState({
        durration: 0,
        current: 0
    });
    useEffect(() => {
        
        const waveSurfer = WaveSurfer.create({
            container: containerRef.current,
            barWidth: 2,

            barHeight: 1, // the height of the wave
            barGap: 0,
            // plugins: [
            //     //@ts-ignore
            //     CursorPlugin.create({
            //         showTime: true,
            //         // opacity: 0.8,
            //         customShowTimeStyle: {
            //             'background-color': '#000',
            //             color: '#fff',
            //             padding: '8px',
            //             'font-size': '10px'
            //         }
            //     })
            // ]

        })
        

        waveSurfer.load(audio);
        
        // waveSurfer.setWaveColor('#227082');
        waveSurfer.on('ready', () => {
            
            waveSurferRef.current = waveSurfer;
            setCurrentState({
                durration: Math.round(waveSurfer.getDuration()),
                current: 0,
            });
        });

        waveSurfer.on('audioprocess', () => {
            
            setCurrentState({
                durration: Math.round(waveSurfer.getDuration()),
                current: Math.round(waveSurfer.getCurrentTime()),
            });
        });
        return () => {
            waveSurfer.destroy();
        }
    }, [audio]);

    useEffect(() => {
        if (currentState.current === currentState.durration) {
            setTimeout(() => {
                toggleIsPlaying(false);
            }, 500);
        }
    }, [currentState]);

    const handlePlayPause = () => {
        
        waveSurferRef.current.playPause();
        toggleIsPlaying(waveSurferRef.current.isPlaying());
    }

    function secondsToHms(d: any) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? (h < 10 ? "" : "") + h : "";
        var mDisplay = m > 0 ? (m < 10 ? "" : "") + m : "0";
        var sDisplay = s > 0 ? (s < 10 ? "0" : "") + s : "00";
        return hDisplay ? hDisplay + ":" : "" + mDisplay + ":" + sDisplay;
    }

    return (
        <div className='audioPayWave w-[calc(100%-20px)] h-[30%]'>
            <div className="flex justify-center h-9 items-center">
                {isPlaying ?
                    // <PauseButton class="playButton" click={handlePlayPause} />
                    <span onClick={handlePlayPause}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" viewBox="0 0 9 12" fill="#4DC7CC"><path d="M6 11.25V0.75H9V11.25H6ZM0 11.25V0.75H3V11.25H0Z" fill="#000000"></path></svg>
                    </span>
                    :
                    // <PlayButton class="playButton" click={handlePlayPause} />}
                    <span onClick={handlePlayPause}>
                        <svg width="20" height="25" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 14.2842V0.28418L11 7.28418L0 14.2842ZM2 10.6342L7.25 7.28418L2 3.93418V10.6342Z" fill="#000000"></path></svg>
                    </span>
                }
                {player && <div className='PlayerInfoDur'>{secondsToHms(currentState.current)} / {secondsToHms(currentState.durration)}</div>}
            </div>
            <div className='waveSet' ref={containerRef} />
        </div>
    )
}

AudioPlayer.propTypes = {
    audio: PropTypes.string.isRequired,
}

export default AudioPlayer