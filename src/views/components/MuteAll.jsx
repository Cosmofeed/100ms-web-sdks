import React, { useCallback, useState } from "react";
import {
  selectAvailableRoleNames,
  useHMSStore,
  useHMSActions,
} from "@100mslive/react-sdk";
import {
  Dialog,
  Text,
  Button,
  RadioGroup,
  Flex,
  Label,
} from "@100mslive/react-ui";
import { DialogContent, DialogRow, DialogSelect } from "../new/DialogContent";

const trackSourceOptions = [
  { label: "Select Track Source", value: "" },
  { label: "regular", value: "regular" },
  { label: "screen", value: "screen" },
  { label: "audioplaylist", value: "audioplaylist" },
  { label: "videoplaylist", value: "videoplaylist" },
];
const trackTypeOptions = [
  { label: "Select Track Type", value: "" },
  { label: "audio", value: "audio" },
  { label: "video", value: "video" },
];
export const MuteAll = ({ showModal, onCloseModal }) => {
  const roles = useHMSStore(selectAvailableRoleNames);
  const hmsActions = useHMSActions();
  const [enabled, setEnabled] = useState("false");
  const [trackType, setTrackType] = useState();
  const [selectedRole, setRole] = useState();
  const [selectedSource, setSource] = useState();

  const resetState = useCallback(() => {
    setEnabled("false");
    setTrackType("");
    setSource("");
    onCloseModal();
  }, [onCloseModal]);

  const muteAll = useCallback(async () => {
    await hmsActions.setRemoteTracksEnabled({
      enabled: enabled === "true",
      type: trackType,
      source: selectedSource,
      roles: selectedRole ? [selectedRole] : undefined,
    });
    resetState();
  }, [
    selectedRole,
    enabled,
    trackType,
    selectedSource,
    hmsActions,
    resetState,
  ]);

  return (
    <Dialog.Root
      open={showModal}
      onOpenChange={value => !value && resetState()}
    >
      <DialogContent title="Mute/Unmute Remote Tracks">
        <DialogSelect
          title="Roles"
          options={[
            { label: "Select Role", value: "" },
            ...roles.map(role => ({ label: role, value: role })),
          ]}
          selected={selectedRole}
          keyField="value"
          labelField="label"
          onChange={setRole}
        />
        <DialogSelect
          title="Track types"
          options={trackTypeOptions}
          selected={trackType}
          onChange={setTrackType}
          keyField="value"
          labelField="label"
        />
        <DialogSelect
          title="Track sources"
          options={trackSourceOptions}
          selected={selectedSource}
          onChange={setSource}
          keyField="value"
          labelField="label"
        />
        <DialogRow>
          <Text variant="md">Track status</Text>
          <RadioGroup.Root value={enabled} onValueChange={setEnabled}>
            <Flex align="center" css={{ cursor: "pointer", mr: "$8" }}>
              <RadioGroup.Item
                value="true"
                id="trackEnableRadio"
                css={{ mr: "$4" }}
              >
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="trackEnableRadio">Enabled</Label>
            </Flex>
            <Flex align="center">
              <RadioGroup.Item
                value="false"
                id="trackDisableRadio"
                css={{ mr: "$4" }}
              >
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="trackDisableRadio">Disabled</Label>
            </Flex>
          </RadioGroup.Root>
        </DialogRow>
        <DialogRow justify="end">
          <Button variant="primary" onClick={muteAll}>
            Apply
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
