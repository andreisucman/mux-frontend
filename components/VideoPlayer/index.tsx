import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import cn from "classnames";
import ReactPlayer from "react-player";
import { Skeleton, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import classes from "./VideoPlayer.module.css";

type Props = {
  showDate?: boolean;
  isRelative?: boolean;
  url?: string;
  disabled?: boolean;
  thumbnail?: string;
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
  }, [typeof onClick]);

  const handleEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  const playIcon = useMemo(
    () => (
      <div
        className={classes.playButton}
        onClick={(e) => {
          e.stopPropagation();
          setPlaying(true);
        }}
      >
        <IconPlayerPlay />
      </div>
    ),
    []
  );

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  return (
    <Skeleton
      className={cn("skeleton", classes.skeleton, { [classes.relative]: isRelative })}
      visible={!url}
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
            <IconPlayerPlay className="icon" />
          </div>
        }
        playing={playing}
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
    </Skeleton>
  );
}
