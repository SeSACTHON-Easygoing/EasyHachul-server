import { ObjectId } from 'bson';

interface Lift {
  no: string;
  location: string;
  section: string;
}

interface Elevator {
  no: string;
  location: string;
  section: string;
}

interface Escalator {
  no: string;
  eno: string;
  location: string;
  section: string;
  direction: string;
}

interface TransferLine {
  line: string;
  distance: string;
  takenTime: string;
}

export interface Station {
  _id: ObjectId;
  stationName: string;
  line: string;
  globalName: {
    jpn: string;
    eng: string;
    chn: string;
  };
  stationCode: string;
  foreignCode: string;
  newAddress: string | null;
  oldAddress: string | null;
  tel: string | null;
  amenity: {
    lift: Array<Lift>;
    toilet: {
      isHandicapped: boolean;
      isAlarmBell: boolean;
      isCCTV: boolean;
      babyChangingStation: string;
    };
    wheelchairRamp: Array<{location: string}>;
    elevator: Array<Elevator>;
    escalator: Array<Escalator>;
    isFeedingRoom: boolean;
  }
  transferLine: Array<TransferLine>;
}