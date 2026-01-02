import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {Sound} from './Sounds';

export type SoundCardProps = {
  sound: Sound;
  onClick: (sound: Sound) => void;
};

export const SoundCard = (props: SoundCardProps) => {
  const {sound, onClick} = props;

  const handleClick = useCallback(() => onClick(sound), [onClick, sound]);

  return (
    <div className="sound-card">
      <h2>
        {sound?.properties.name}
      </h2>

      <hr className="divider" />

      {sound?.properties.description}

      {/* <audio controls preload="metadata" src={"https://object-arbutus.cloud.computecanada.ca/soundscapes-public/" + sound?.properties.soundfile}> </audio> */}
      <p> audio here </p>

      <p> images here </p>
      {/* {sound?.properties.images.map((url, index) => (
        <img key={index} src={"https://object-arbutus.cloud.computecanada.ca/soundscapes-public/" + url}></img>
      ))} */}
    </div>
  )
}