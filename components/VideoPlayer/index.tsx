import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import cn from "classnames";
import ReactPlayer from "react-player";
import { Stack, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import classes from "./VideoPlayer.module.css";

type Props = {
  showDate?: boolean;
  isRelative?: boolean;
  url?: string;
  disabled?: boolean;
  thumbnail?: string;
  playOnBufferEnd?: boolean;
  createdAt: string;
  customStyles?: { [key: string]: any };
  onClick?: () => any;
  setIsBuffering?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function VideoPlayer({
  url,
  showDate,
  isRelative,
  thumbnail,
  createdAt,
  playOnBufferEnd,
  customStyles,
  setIsBuffering,
  onClick,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayerClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      setPlaying((prev) => !prev);  
    }
  }, [typeof onClick, playing]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleOnDuration = (playing: boolean) => {
    if (setIsBuffering) setIsBuffering(false);
    if (playOnBufferEnd && !playing) setPlaying(true);
  };

  const playIcon = useMemo(
    () => (
      <div
        className={classes.playButton}
        onClick={(e) => {
          e.stopPropagation();
          setPlaying(true);
        }}
      >
        <IconPlayerPlayFilled className={classes.playIcon} />
      </div>
    ),
    []
  );

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  return (
    <Stack
      className={cn("skeleton", classes.skeleton, { [classes.relative]: isRelative })}
      style={customStyles ? customStyles : {}}
    >
      {!playing && playIcon}
      <ReactPlayer
        url={url}
        style={{
          position: "absolute",
          objectFit: "contain",
          inset: 0,
        }}
        light={thumbnail}
        onBuffer={setIsBuffering ? () => setIsBuffering(true) : undefined}
        onDuration={() => handleOnDuration(playing)}
        playing={playing}
        playIcon={
          <div
            className={classes.playButton}
            onClick={
              onClick
                ? (e: any) => {
                    e.stopPropagation();
                    onClick();
                  }
                : () => {}
            }
          >
            <IconPlayerPlayFilled className={classes.playIcon} />
          </div>
        }
        width={"100%"}
        height={"100%"}
        onClick={handlePlayerClick}
        onEnded={handleEnded}
        config={{
          file: {
            attributes: {
              preload: "auto",
            },
          },
        }}
        ref={playerRef}
      />

      {showDate && <Text className={classes.date}>{formattedDate}</Text>}
    </Stack>
  );
}
