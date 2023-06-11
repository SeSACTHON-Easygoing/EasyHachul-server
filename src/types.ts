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
    wheelchairRamp: Array<{ location: string }>;
    elevator: Array<Elevator>;
    escalator: Array<Escalator>;
    isFeedingRoom: boolean;
  };
  transferLine: Array<TransferLine>;
}

export interface StStaion {
  stPath: {                          //출발도보
    exit: Array<string>;            //["3번/4번 출입구 사이 엘리베이터", "7번/8번 출입구 사이 엘리베이터"]
    route: string;                   //"신도림 방면" (필요없지 않나?)
    detail: Array<Array<string>>;  //[["1) (1F) 3번/4번 출입구 사이 엘리베이터 탑승", ..., "6) 승차 (휠체어칸)"], [...]]
  };
  onInfo: {                          //승차정보
    stationName: string;                     //"대림역"
    onLine: string;                //승차호선 "2호선"
    route: string;                   //"신도림역 방면"
    toWay: string;                    //"성수(내선)행"
    arrived: string;                //"2분 42초"
    etc: {                         // 기타정보
      wheelchair: string;       //"2-1, 6-4, 8-2" (여기 key는 한글로 가능한가용?)
      shtDistance: string;       //"3-3, 7-1"      (여기 key는 한글로 가능한가용?)
      lngDistance: string;       //"5-1, 9-1, 9-4" (여기 key는 한글로 가능한가용?)
    };
    mvTime: number | string;      //18 or "18분"
    mvPathCnt: number | string;     //7 or "7개역 이동"
    mvPathNm: Array<string>;           //["영등포역", ..., "남영역"]
  };
}

export interface TrStation {
  offInfo: {                         //하차정보
    stationName: string;                     //"신도림역"
    offLine: string;               //하차호선 "2호선"
    onLine: string;                //승차호선 "1호선"
    door: string;                    // "내리는 문 왼쪽"   (방면, 행빠지고 문있음)
    arrived: string;                //"2분 42초"
    etc: {                         //기타정보
      shtOnLift: string;    //"2-1, 6-4, 8-2" (여기 key는 한글로 가능한가용?)
      shtDistance: string;      //"3-3, 7-1"        (여기 key는 한글로 가능한가용?)
      lngDistance: string;      //"5-1, 9-1, 9-4"   (여기 key는 한글로 가능한가용?)
    };
  };
  trInfo: {                         //환승정보
    route: string;                  //"신도림 방면" (필요없지 않나?)
    detail: Array<string>;                //["1) (1F) 3번/4번 출입구 사이 엘리베이터 탑승", ..., "6) 승차 (휠체어칸)"]
  };
  onInfo: {                         //승차정보
    stationName: string;                   //"대림역"
    line: string;               //"2호선"
    route: string;                 //"신도림역 방면"
    toWay: string;                  //"성수(내선)행"
    arrived: string;              //"2분 42초"
    etc: {                       //기타정보
      wheelchair: string;    //"2-1, 6-4, 8-2" (여기 key는 한글로 가능한가용?)
      shtDistance: string;    //"3-3, 7-1"      (여기 key는 한글로 가능한가용?)
      lngDistance: string;    //"5-1, 9-1, 9-4" (여기 key는 한글로 가능한가용?)
    }
    mvTime: number | string;    //18 or "18분"
    mvPathCnt: number | string;  //7 or "7개역 이동"
    mvPathNm: Array<string>;        //["영등포역", ..., "남영역"]
  };
}

export interface EndStation {
  offInfo: {                        //하차정보
    stationName: string;                   //"신도림역"
    offLine: string;              //하차호선 "2호선"
    door: string;                   // "내리는 문 왼쪽"   (방면, 행빠지고 문있음)
    arrived: string;               //"2분 42초"
    etc: {                        //기타정보
      shtOnLift: string;   //"2-1, 6-4, 8-2"  (휠체어 전용석 대신 이거)
      shtDistance: string;     //"3-3, 7-1"        (여기 key는 한글로 가능한가용?)
      lngDistance: string;     //"5-1, 9-1, 9-4"   (여기 key는 한글로 가능한가용?)
    };
  };
  endPath: {                         //도착도보
    exit: Array<string>;            //["3번/4번 출입구 사이 엘리베이터", "7번/8번 출입구 사이 엘리베이터"]
    route: string;                   //"신도림 방면" (필요없지 않나?)
    detail: Array<Array<string>>;  //[["1) (1F) 3번/4번 출입구 사이 엘리베이터 탑승", ..., "6) 승차 (휠체어칸)"], [...]]
  };
}

export interface RouteAPI {
  globalStartName: string; // 출발역 명
  globalEndName: string; // 도착역 명
  globalTravelTime: number; // 전체 운행소요시간(분)
  globalDistance: number; // 전체 운행거리(Km)
  globalStationCount: number; // 전체 정차역 수
  fare: number; // 카드요금 (성인기준)
  cashFare: number; // 현금요금 (성인기준)
  driveInfoSet: { // 확장노드
    driveInfo: Array<{
      laneID: string; // 승차역 ID
      laneName: string; // 승차역 호선명
      startName: string; // 승차역 명
      stationCount: number; // 이동 역 수
      wayCode: number; // 방면코드(1:상행,2:하행)
      wayName: string; // 방면 명
    }>
  };
  exChangeInfoSet?: {
    exChangeInfo: Array<{
      laneName: string; // 승차역 호선명
      startName: string; // 승차역 명
      exName: string; // 환승역 명
      exSID: number; // 환승역 ID
      fastTrain: number; // 빠른 환승 객차 번호
      fastDoor: number; // 빠른 환승 객차 문 번호
      exWalkTime: number; // 환승소요시간(초)
    }>
  };
  stationSet: {
    stations: Array<{
      startID: number; // 출발역 ID
      startName: string; // 출발역 명
      endSID: number; // 도착역 ID
      endName: string; // 도착역 명
      travelTime: number; // 누적 운행시간(분)
    }>
  }
}