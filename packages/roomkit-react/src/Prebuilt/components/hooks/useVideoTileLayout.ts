import React, { useContext } from 'react';

type TileContextType = {
  enableSpotlightingPeer: boolean;
  hideParticipantNameOnTile?: boolean;
  roundedVideoTile?: boolean;
  hideAudioMuteOnTile?: boolean;
  objectFit?: 'cover' | 'contain';
};

export const VideoTileContext = React.createContext<TileContextType>({
  enableSpotlightingPeer: true,
  hideParticipantNameOnTile: false,
  roundedVideoTile: true,
  hideAudioMuteOnTile: false,
  objectFit: 'contain',
});

export const useVideoTileContext = () => {
  const context = useContext(VideoTileContext);
  return context;
};