import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconPlayerPause, IconPlayerPlayFilled } from "@tabler/icons-react";
import cn from "classnames";
import ReactPlayer from "react-player";
import { Loader, Stack, Text } from "@mantine/core";
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
  const [buffering, setBuffering] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayerClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      setPlaying((prev) => !prev);
    }
  }, [onClick]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleOnDuration = (isPlaying: boolean) => {
    if (playOnBufferEnd && !isPlaying) setPlaying(true);
    if (onLoad) onLoad();
  };

  const handleBuffer = useCallback(() => setBuffering(true), []);
  const handleBufferEnd = useCallback(() => setBuffering(false), []);

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
    [playing, handlePlayerClick]
  );

  const formattedDate = useMemo(
    () => (createdAt ? formatDate({ date: createdAt }) : null),
    [createdAt]
  );

  return (
    <Stack
      className={cn("skeleton", classes.skeleton, {
        [classes.relative]: isRelative,
      })}
      style={customStyles ?? {}}
    >
      {onClick && <div className={classes.overlay} onClick={handlePlayerClick} />}

      {buffering && (
        <Stack m="auto">
          <Loader
            size="lg"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        </Stack>
      )}

      {playIcon}

      <ReactPlayer
        ref={playerRef}
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
        width="100%"
        height="100%"
        onClickPreview={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onEnded={handleEnded}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        config={{
          file: {
            attributes: {
              preload: "auto",
            },
          },
        }}
      />

      {showDate && formattedDate && <Text className={classes.date}>{formattedDate}</Text>}
    </Stack>
  );
}
