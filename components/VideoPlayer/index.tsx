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
  createdAt: string;
  customStyles?: { [key: string]: any };
  onClick?: () => any;
};

export default function VideoPlayer({
  url,
  showDate,
  isRelative,
  thumbnail,
  createdAt,
  playOnBufferEnd,
  customStyles,
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
  };

  const playIcon = useMemo(
    () => (
      <div
        className={cn(classes.playButton, { [classes.left]: playing })}
        onClick={handlePlayerClick}
      >
        {playing ? (
          <IconPlayerPause className={classes.playIcon} />
        ) : (
          <IconPlayerPlayFilled className={classes.playIcon} />
        )}
      </div>
    ),
    [playing]
  );

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

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

      {showDate && <Text className={classes.date}>{formattedDate}</Text>}
    </Stack>
  );
}
