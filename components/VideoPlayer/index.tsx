import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconPlayerPause, IconPlayerPlayFilled } from "@tabler/icons-react";
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
  createdAt?: string;
  customStyles?: { [key: string]: any };
  onClick?: () => any;
  onLoad?: () => any;
};

export default function VideoPlayer({
  url,
  showDate,
  isRelative,
  thumbnail,
  createdAt,
  playOnBufferEnd,
  customStyles,
  onLoad,
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
    if (playOnBufferEnd && !playing) setPlaying(true);
    if (onLoad) onLoad();
  };

  const playIcon = useMemo(
    () => (
      <div
        className={cn(classes.playButton, { [classes.left]: playing })}
        onClick={handlePlayerClick}
      >
        {playing ? (
          <IconPlayerPause size={40} className={classes.playIcon} />
        ) : (
          <IconPlayerPlayFilled size={40} className={classes.playIcon} />
        )}
      </div>
    ),
    [playing]
  );

  const formattedDate = useMemo(() => (createdAt ? formatDate({ date: createdAt }) : null), []);

  return (
    <Stack
      className={cn("skeleton", classes.skeleton, { [classes.relative]: isRelative })}
      style={customStyles ? customStyles : {}}
    >
      {onClick && <div className={classes.overlay} onClick={handlePlayerClick} />}
      {playIcon}
      <ReactPlayer
        url={url}
        style={{
          position: "absolute",
          objectFit: "contain",
          inset: 0,
        }}
        light={thumbnail}
        onDuration={() => handleOnDuration(playing)}
        playing={playing}
        playIcon={playIcon}
        width={"100%"}
        height={"100%"}
        onClickPreview={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
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

      {showDate && formattedDate && <Text className={classes.date}>{formattedDate}</Text>}
    </Stack>
  );
}
