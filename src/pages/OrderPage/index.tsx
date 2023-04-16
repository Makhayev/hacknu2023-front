import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Spin,
  Steps,
  notification,
} from "antd";
import axios from "axios";
import {
  FullscreenControl,
  GeolocationControl,
  Map,
  YMaps,
} from "react-yandex-maps";
import Search from "antd/es/input/Search";

export const OrderPage: FC = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [iin, setIin] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [CON, setCON] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [trustedPerson, setTrustedPerson] = useState<boolean>(false);
  const [trustedPersonIin, setTrustedPersonIin] = useState<string>("");
  const [open2, setOpen2] = useState(false);
  const [trustedPersonObj, setTrustedPersonObj] = useState<{
    iin: string;
    firstName: string;
    lastName: string;
    middleName: string;
  }>();
  const [isSearching, setIsSearching] = useState(false);
  const [options, setOptions] = useState([
    {
      label: "бір",
      value: "екі",
    },
  ]);
  const [mapState, setMapState] = useState({
    center: [51.1605, 71.4704],
    zoom: 9,
  });
  const [oblast, setOblast] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [flat, setFlat] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [corpus, setCorpus] = useState("");
  const [nameOfBuilding, setNameOfBuilding] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [mailService, setMailService] = useState<number>();
  const [kilometres, setKilometres] = useState<string>("0");
  const [price, setPrice] = useState<string>("0.00");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [iins, setiins] = useState([]);
  const [potentialUser, setPotentialUser] = useState<any>();
  const [isVideo, setIsVideo] = useState(false);
  const handleIinSubmit = (potUserIin?: string) => {
    setIsSpinning(true);
    axios
      .get(`http://10.101.7.135:8081/getInfo/${id}/${potUserIin ?? iin}`)
      .then((res) => {
        setName(
          `${res.data.FL.firstName} ${res.data.FL.lastName} ${res.data.FL.middleName}`
        );
        const response = res.data.DocumentStatus.data;
        setIsSpinning(false);
        setOrderNumber(response.requestId);
        setServiceName(response.serviceType.nameKz);
        setCON(response.organization.nameRu);
        setPhone(res.data.BMG.phone);
        handleNextStep();
      })
      .catch(() => {
        setIsSpinning(false);
        notification.error({ message: "Қате" });
      });
  };
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const searchOnMap = (e: any): any => {
    setIsSearching(true);
    axios
      .get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=086d27be-6f48-4c9d-830b-b6652da76c52&geocode=${e}&format=json`
      )
      .then((res) => {
        const responseObj =
          res.data.response.GeoObjectCollection.featureMember.map(
            (item: any) => {
              return {
                label: item.GeoObject.metaDataProperty.GeocoderMetaData.text,
                value: item.GeoObject.Point.pos,
              };
            }
          );
        setOptions(responseObj);
      });
  };
  const showAddress = (e: any): any => {
    setIsSearching(false);
    setMapState({ center: [e.split(" ")[1], e.split(" ")[0]], zoom: 18 });
  };
  const successCallback = (position: any) => {
    setMapState({
      center: [position.coords.latitude, position.coords.longitude],
      zoom: 16,
    });
  };

  const errorCallback = (error: any) => {
    console.log(error);
  };
  const handleMapClick = (e: any): void => {
    const coords = e.get("coords");
    axios
      .get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=086d27be-6f48-4c9d-830b-b6652da76c52&geocode=${coords?.[1]},${coords?.[0]}&format=json`
      )
      .then((res) => {
        const responseObj =
          res.data.response.GeoObjectCollection.featureMember[0].GeoObject
            .metaDataProperty.GeocoderMetaData?.Address?.Components;
        responseObj.forEach((item: any) => {
          if (item.kind === "province") {
            setOblast(item.name);
          }
          if (item.kind === "locality") {
            setCity(item.name);
          }
          if (item.kind === "street") {
            setStreet(item.name);
          }
          if (item.kind === "house") {
            setHouseNumber(item.name);
          }
        });
      });
  };

  useEffect(() => {
    console.log(iins);
    if (iins.length > 30) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const uniques = [...new Set(iins)];
      console.log(uniques);
      const obj: any = {};
      uniques.forEach((unique) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[unique] = 0;
      });
      iins.forEach((iin) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[iin] += 1;
      });
      let max = -1;
      let maxIin = "";
      Object.keys(obj).forEach((key) => {
        if (obj[key] > max) {
          max = obj[key];
          maxIin = key;
        }
      });
      console.log(maxIin);
      axios.get(`http://10.101.7.135:8081/getFL/${maxIin}`).then((res) => {
        console.log(res.data);
        setPotentialUser(res.data);
        setOpen2(true);
      });
    }
  }, [iins]);

  const videoRef = useRef(null);
  useEffect(() => {
    const videoElement = videoRef.current;
    const plzzzz: any = [];

    // Get access to user's video camera
    if (navigator?.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          videoElement.srcObject = stream;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          videoElement.play();

          // Send video stream frames to backend server
          function sendVideoFrames() {
            const canvasElement = document.createElement("canvas");
            const context = canvasElement.getContext("2d");
            context?.drawImage(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              videoElement,
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );
            const imageData = canvasElement.toDataURL("image/jpeg", 0.8); // Convert canvas to base64-encoded JPEG image data
            if (plzzzz.length > 30) {
              console.log(plzzzz);
              setiins(plzzzz);
              return;
            }
            axios
              .post(
                "http://10.101.45.17:81/foo",
                {
                  video_frame: imageData,
                },
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                if (response.data.message) {
                  plzzzz.push(response.data.message);
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                }
              })
              .catch((error) => {
                // Handle error
                console.error("Failed to upload video frame:", error);
              })
              .finally(() => {
                requestAnimationFrame(sendVideoFrames);
              });
          }
          if (plzzzz.length < 30) {
            sendVideoFrames();
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    }

    // Cleanup on unmount
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (videoElement.srcObject) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideo]);
  if (isSpinning) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Steps: {
              colorPrimary: "#0ACF83",
            },
          },
        }}
      >
        <div className="tw-flex tw-justify-center">
          <Steps
            current={currentStep}
            className="tw-mt-10 tw-w-4/5"
            labelPlacement="vertical"
            items={[
              {
                title: "ЖСН",
              },
              {
                title: "Тапсырыс туралы ақпарат",
              },
              {
                title: "Алушы туралы ақпарат",
              },
              {
                title: "Жеткізу мекен жайы",
              },
              {
                title: "Дайын",
              },
            ]}
          />
        </div>
        {currentStep === 0 ? (
          <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center tw-w-1/4">
              <div className="tw-text-5xl"> Құжаттарды Жеткізу</div>
              <div className=" tw-mt-4">
                Сіздің #{id} құжатыңыз дайын. Жалғастыру үшін ЖСН-ыңызды
                енгізіңіз.
              </div>
              <div className="tw-mt-4 tw-w-full tw-ml-4">ЖСН</div>
              <Input
                className="tw-p-2"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setIin(e.target.value);
                }}
              />
              <Button
                className="tw-h-12 tw-mt-8 tw-bg-green tw-w-full tw-text-white"
                onClick={() => handleIinSubmit()}
              >
                Жалғастыру
              </Button>
              <div
                className="tw-text-darkBlue tw-w-full tw-mt-8 tw-text-center tw-cursor-pointer"
                onClick={() => setIsVideo(true)}
              >
                Face ID арқылы кіру
                <video ref={videoRef} />
              </div>
            </div>
          </div>
        ) : currentStep === 1 ? (
          <div className="tw-w-full tw-flex tw-flex-col tw-items-center">
            <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center">
              <div className="tw-text-5xl">Сәлеметсіз бе,</div>
              <div className="tw-text-3xl tw-text-green">{name}</div>
            </div>
            <div
              className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
              style={{
                borderColor: "#6677F726",
              }}
            >
              <div className="tw-text-2xl tw-mb-4">Тапсырыс туралы ақпарат</div>
              <div className="tw-mb-4 tw-font-bold">
                Тапсырыс номері:
                <span className="tw-font-normal"> {orderNumber}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Қызмет атауы:
                <span className="tw-font-normal"> {serviceName}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Бөлім: <span className="tw-font-normal">{CON}</span>
              </div>
            </div>
            <div className="tw-flex tw-justify-end tw-w-1/2 tw-mr-4">
              <Button
                className="tw-bg-green tw-text-white tw-h-10 tw-mt-4"
                onClick={handleNextStep}
              >
                Жалғастыру
              </Button>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="tw-w-full tw-flex tw-flex-col tw-items-center">
            <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center">
              <div className="tw-text-5xl">Сәлеметсіз бе,</div>
              <div className="tw-text-3xl tw-text-green">{name}</div>
            </div>
            <div
              className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
              style={{
                borderColor: "#6677F726",
              }}
            >
              <div className="tw-text-2xl tw-mb-4">Тапсырыс туралы ақпарат</div>
              <div className="tw-mb-4 tw-font-bold">
                Аты:
                <span className="tw-font-normal"> {name?.split(" ")[0]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Тегі:
                <span className="tw-font-normal"> {name?.split(" ")[1]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Әкесінің аты:
                <span className="tw-font-normal">{name?.split(" ")[2]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold tw-flex tw-items-center">
                Телефон нөмірі:
                <Input
                  disabled
                  className="tw-font-normal tw-h-8 tw-w-80 tw-inline tw-ml-4"
                  placeholder={phone}
                />
              </div>
              <ConfigProvider
                theme={{
                  components: {
                    Checkbox: {
                      colorPrimary: "#0ACF83",
                    },
                  },
                }}
              >
                <Checkbox
                  value={trustedPerson}
                  onChange={(event) => {
                    setTrustedPerson(event.target.checked);
                  }}
                >
                  Сенімді адам арқылы тапсырысты қабылдау
                </Checkbox>
              </ConfigProvider>
            </div>
            {trustedPerson && (
              <div className="tw-my-4 tw-font-bold tw-flex tw-items-center">
                ЖСН
                <Input
                  value={trustedPersonIin}
                  className="tw-font-normal tw-h-8 tw-w-80 tw-inline tw-ml-4"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value.length === 12) {
                      axios
                        .get(
                          `http://10.101.7.135:8081/getFL/${event.target.value}`
                        )
                        .then((res) => {
                          setTrustedPersonObj(res.data);
                        })
                        .catch(() => {
                          notification.error({ message: "Қате" });
                        });
                    } else if (event.target.value.length < 13) {
                      setTrustedPersonIin(event.target.value);
                    }
                  }}
                />
              </div>
            )}
            {trustedPersonObj?.iin && (
              <div
                className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
                style={{
                  borderColor: "#6677F726",
                }}
              >
                <div className="tw-text-2xl tw-mb-4">
                  Тапсырыс туралы ақпарат
                </div>
                <div className="tw-mb-4 tw-font-bold">
                  аты:
                  <span className="tw-font-normal">
                    {" "}
                    {trustedPersonObj?.firstName}
                  </span>
                </div>
                <div className="tw-mb-4 tw-font-bold">
                  тегі:
                  <span className="tw-font-normal">
                    {" "}
                    {trustedPersonObj?.lastName}
                  </span>
                </div>
                <div className="tw-mb-4 tw-font-bold">
                  Әкесінің аты:
                  <span className="tw-font-normal">
                    {trustedPersonObj?.middleName}
                  </span>
                </div>
              </div>
            )}
            <div className="tw-flex tw-justify-end tw-w-1/2 tw-mr-4">
              <Button
                className="tw-bg-green tw-text-white tw-h-10 tw-mt-4"
                onClick={handleNextStep}
              >
                Жалғастыру
              </Button>
            </div>
          </div>
        ) : currentStep === 3 ? (
          <div className="tw-flex tw-mt-8 tw-justify-between">
            <div className="tw-w-1/2 tw-mx-8 tw-mt-6">
              <YMaps>
                {isSearching ? (
                  <Select
                    defaultValue="Таңдау"
                    onChange={(e: any) => showAddress(e)}
                    style={{
                      width: "100%",
                    }}
                    size="large"
                    options={options}
                  />
                ) : (
                  <Search
                    placeholder="Адресс іздеу"
                    allowClear
                    enterButton={<Button>Izdeu</Button>}
                    size="large"
                    onSearch={(e: any) => searchOnMap(e)}
                  />
                )}
                <Map
                  height="400px"
                  width="100%"
                  defaultState={mapState}
                  state={mapState}
                  onClick={(e: any) => handleMapClick(e)}
                >
                  <FullscreenControl />
                  <GeolocationControl
                    options={{
                      float: "left",
                    }}
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        successCallback,
                        errorCallback
                      );
                    }}
                  />
                </Map>
              </YMaps>
            </div>
            <div className="tw-w-1/2 tw-mr-8">
              <div className="tw-flex">
                <div>
                  <label>Область</label>
                  <Input
                    value={oblast}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOblast(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Қала</label>
                  <Input
                    value={city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCity(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="tw-flex">
                <div>
                  <label>Көше</label>
                  <Input
                    value={street}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStreet(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Үй нөмірі</label>
                  <Input
                    value={houseNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setHouseNumber(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="tw-flex tw-justify-between">
                <div>
                  <label>Пәтер</label>
                  <Input
                    value={flat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFlat(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Подъезд</label>
                  <Input
                    value={entrance}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEntrance(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Қабат</label>
                  <Input
                    value={floor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFloor(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Корпус</label>
                  <Input
                    value={corpus}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCorpus(e.target.value)
                    }
                  />
                </div>
              </div>

              <label>Тұрғын үй кешенінің аты</label>
              <Input
                value={nameOfBuilding}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNameOfBuilding(e.target.value)
                }
              />
              <label>Қосымша ақпарат</label>
              <Input
                value={additionalInfo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAdditionalInfo(e.target.value)
                }
              />
              <Radio.Group
                onChange={(event: RadioChangeEvent) => {
                  setMailService(event.target.value);
                }}
                value={mailService}
                className="tw-flex tw-justify-around tw-w-full tw-mt-4"
              >
                <Radio value={1}>Kaspi</Radio>
                <Radio value={2}>PonyExpress</Radio>
                <Radio value={3}>DHL</Radio>
              </Radio.Group>
              <div className="tw-flex tw-justify-center tw-w-full tw-mt-4">
                <Button
                  onClick={() => {
                    axios
                      .get(
                        `http://10.101.7.135:8081/orders/calculate/${mailService}/${street} ${houseNumber}, ${city} ${oblast}`
                      )
                      .then((res) => {
                        setKilometres(res.data[1]);
                        setPrice(res.data[0]);
                      });
                  }}
                >
                  Есептеу
                </Button>
              </div>
              <div className="tw-flex tw-font-bold tw-text-4xl tw-justify-around">
                <div>₸{price}</div>
                <div>{kilometres}KM</div>
              </div>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Checkbox: {
                        colorPrimary: "#0ACF83",
                      },
                    },
                  }}
                >
                  <div className="tw-flex tw-flex-col">
                    <Checkbox>
                      Мен{" "}
                      <a target="_blank" href="/offer.pdf">
                        оферта шартына
                      </a>{" "}
                      келісім беремін
                    </Checkbox>
                    <Checkbox
                      style={{
                        marginLeft: 0,
                      }}
                    >
                      Мен{" "}
                      <a target="_blank" href="/confidentiality.PDF">
                        құпиялылық саясаты шартына
                      </a>{" "}
                      келісім беремін
                    </Checkbox>
                  </div>
                </ConfigProvider>
              </div>
              {price !== "0.00" && (
                <div className="tw-w-full tw-flex tw-justify-center">
                  <Button
                    className="tw-bg-green tw-text-white"
                    onClick={() => {
                      axios
                        .put(
                          `http://10.101.7.135:8081/orders/createOrder/${orderNumber}/${mailService}/${street} ${houseNumber} квартира ${flat} подъезд ${entrance} этаж ${floor} ${corpus}, ${city} ${oblast}/${trustedPersonIin}`
                        )
                        .then(() => {
                          handleNextStep();
                        });
                    }}
                  >
                    Жалғастыру
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tw-w-full tw-flex tw-flex-col tw-items-center">
            <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center">
              <div className="tw-text-5xl">Сәлеметсіз бе,</div>
              <div className="tw-text-3xl tw-text-green">{name}</div>
            </div>
            <div
              className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
              style={{
                borderColor: "#6677F726",
              }}
            >
              <div className="tw-text-2xl tw-mb-4">Тапсырыс туралы ақпарат</div>
              <div className="tw-mb-4 tw-font-bold">
                Аты:
                <span className="tw-font-normal"> {name?.split(" ")[0]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Тегі:
                <span className="tw-font-normal"> {name?.split(" ")[1]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Әкесінің аты:
                <span className="tw-font-normal">{name?.split(" ")[2]}</span>
              </div>
            </div>
            <div
              className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
              style={{
                borderColor: "#6677F726",
              }}
            >
              <div className="tw-text-2xl tw-mb-4">Тапсырыс туралы ақпарат</div>
              <div className="tw-mb-4 tw-font-bold">
                Тапсырыс нөмірі:
                <span className="tw-font-normal"> {orderNumber}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Қызмет атауы:
                <span className="tw-font-normal"> {serviceName}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Бөлім: <span className="tw-font-normal">{CON}</span>
              </div>
            </div>
            <div className="tw-mt-8 tw-w-1/2 tw-border-solid tw-border-dark tw-border-2 tw-rounded-xl tw-p-4">
              <div className="tw-font-bold tw-text-4xl tw-pt-4 tw-pl-4">
                Төлем қабылдау
              </div>
              <Divider className="tw-border-dark tw-w-1/2" />
              <div className="tw-flex tw-justify-around tw-font-bold tw-text-4xl">
                <div>T{price}</div>
                <div>{kilometres}KM</div>
              </div>
              <Divider className="tw-border-dark tw-w-1/2" />
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex tw-flex-col tw-px-8">
                  <div>
                    <Input />
                    <label>Картаңыздың нөмірі</label>
                  </div>
                  <div className="tw-flex tw-mt-4 tw-justify-between">
                    <div className="tw-w-1/4">
                      <Input />
                      <label>MM/YY</label>
                    </div>
                    <div className="tw-w-1/4">
                      <Input />
                      <label>CVC/CVV</label>
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-items-center">
                  <div className="tw-font-bold tw-text-center">Төлем жолы</div>
                  <div>VISA</div>
                </div>
              </div>
              <div className="tw-w-full tw-flex tw-justify-end">
                <Button
                  className="tw-mr-8 tw-bg-green tw-text-white"
                  onClick={() => {
                    setIsPaid(true);
                    axios.put(
                      `http://10.101.7.135:8081/orders/approvePayment/${id}`
                    );
                  }}
                >
                  Pay
                </Button>
              </div>
            </div>
            <div className="tw-mt-8 tw-flex tw-justify-end tw-mr-8">
              <Button
                disabled={!isPaid}
                className="tw-bg-green tw-text-white"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Жалғастыру
              </Button>
            </div>
          </div>
        )}
      </ConfigProvider>
      <Modal
        open={open2}
        closable
        onCancel={() => setOpen2(false)}
        footer={null}
      >
        Сіздің толық аты жөніңіз {potentialUser?.firstName}{" "}
        {potentialUser?.lastName} {potentialUser?.middleName} ме?
        <Button
          className="tw-bg-green"
          onClick={() => {
            handleIinSubmit(potentialUser?.iin);
          }}
        >
          ИӘ
        </Button>
      </Modal>
      <Modal
        open={open}
        closable
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
        maskClosable
      >
        <div className="tw-font-semibold tw-text-xl tw-text-center">
          <div className="tw-font-bold tw-text-2xl"> Назар аударыңыз!</div>
          <div>
            Құжаттар тек қана тапсырыс берушіге! Егер беруші болмаса нотариалдық
            сенімхатыңыз болу қажет!
          </div>
        </div>
      </Modal>
    </>
  );
};
