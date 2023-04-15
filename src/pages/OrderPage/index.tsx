import React, { ChangeEvent, FC, useState } from "react";
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
  const [currentStep, setCurrentStep] = useState(5);
  const [iin, setIin] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [CON, setCON] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [trustedPerson, setTrustedPerson] = useState<boolean>(false);
  const [trustedPersonIin, setTrustedPersonIin] = useState<string>("");
  const [trustedPersonObj, setTrustedPersonObj] = useState<{
    iin: string;
    firstName: string;
    lastName: string;
    middleName: string;
  }>();
  const [isSearching, setIsSearching] = useState(false);
  const [options, setOptions] = useState([
    {
      label: "huinya",
      value: "cringe",
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
  const handleIinSubmit = () => {
    setIsSpinning(true);
    axios.get(`http://10.101.7.135:8081/getInfo/${id}/${iin}`).then((res) => {
      setName(
        `${res.data.FL.firstName} ${res.data.FL.lastName} ${res.data.FL.middleName}`
      );
      const response = res.data.DocumentStatus.data;
      setOrderNumber(response.requestId);
      setServiceName(response.serviceType.nameKz);
      setCON(response.organization.nameRu);
      setPhone(res.data.BMG.phone);
      setIsSpinning(false);
    });
    handleNextStep();
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
                title: "ИИН",
              },
              {
                title: "Данные о заказе",
              },
              {
                title: "Данные о получателе",
              },
              {
                title: "Адрес доставки",
              },
              {
                title: "Готово",
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
                onClick={handleIinSubmit}
              >
                Жалғастыру
              </Button>
              <div className="tw-text-darkBlue tw-w-full tw-mt-8 tw-text-center">
                Face ID арқылы кіру
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
              <div className="tw-text-2xl tw-mb-4">Данные о заказе</div>
              <div className="tw-mb-4 tw-font-bold">
                Номер заказа:
                <span className="tw-font-normal"> {orderNumber}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Наименование услуги:
                <span className="tw-font-normal"> {serviceName}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Отделение: <span className="tw-font-normal">{CON}</span>
              </div>
            </div>
            <div className="tw-flex tw-justify-end tw-w-1/2 tw-mr-4">
              <Button
                className="tw-bg-green tw-text-white tw-h-10 tw-mt-4"
                onClick={handleNextStep}
              >
                Жалгастыру
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
              <div className="tw-text-2xl tw-mb-4">Данные о заказе</div>
              <div className="tw-mb-4 tw-font-bold">
                Имя:
                <span className="tw-font-normal"> {name?.split(" ")[0]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Фамилия:
                <span className="tw-font-normal"> {name?.split(" ")[1]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Отчество:
                <span className="tw-font-normal">{name?.split(" ")[2]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold tw-flex tw-items-center">
                Номер телефона:
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
                  Получение доставки доверенным лицом
                </Checkbox>
              </ConfigProvider>
            </div>
            {trustedPerson && (
              <div className="tw-my-4 tw-font-bold tw-flex tw-items-center">
                ИИН
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
                <div className="tw-text-2xl tw-mb-4">Данные о заказе</div>
                <div className="tw-mb-4 tw-font-bold">
                  Имя:
                  <span className="tw-font-normal">
                    {" "}
                    {trustedPersonObj?.firstName}
                  </span>
                </div>
                <div className="tw-mb-4 tw-font-bold">
                  Фамилия:
                  <span className="tw-font-normal">
                    {" "}
                    {trustedPersonObj?.lastName}
                  </span>
                </div>
                <div className="tw-mb-4 tw-font-bold">
                  Отчество:
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
                Жалгастыру
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
                  <label>Город</label>
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
                  <label>Улица</label>
                  <Input
                    value={street}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStreet(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Номер дома</label>
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
                  <label>Квартира</label>
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
                  <label>Этаж</label>
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

              <label>Наименование ЖК</label>
              <Input
                value={nameOfBuilding}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNameOfBuilding(e.target.value)
                }
              />
              <label>Дополнительная информация</label>
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
                <Radio value={2}>Pony</Radio>
                <Radio value={3}>DHL</Radio>
              </Radio.Group>
              <div className="tw-flex tw-justify-center tw-w-full tw-mt-4">
                <Button
                  onClick={() => {
                    axios
                      .post("http://10.101.7.135:8081/orders/calculate", {
                        customerIIN: iin,
                        requestId: id,
                        con: CON,
                        courierCompanyId: mailService,
                        address: `${street} ${houseNumber} квартира ${flat} подъезд ${entrance} этаж ${floor} ${corpus}, ${city} ${oblast}`,
                        representative: trustedPersonIin ?? "",
                      })
                      .then((res) => {
                        console.log(res.data);
                        setKilometres(res.data[1]);
                        setPrice(res.data[0]);
                      });
                  }}
                >
                  Calculate
                </Button>
              </div>
              <div className="tw-flex tw-font-bold tw-text-4xl tw-justify-around">
                <div>₸{price}</div>
                <div>{kilometres}KM</div>
              </div>
              {price !== "0.00" && (
                <Button
                  className="tw-bg-green"
                  onClick={() => {
                    axios
                      .post("http://10.101.7.135:8081/orders/createOrder", {
                        customerIIN: iin,
                        requestId: id,
                        con: CON,
                        courierCompanyId: mailService,
                        address: `${street} ${houseNumber} квартира ${flat} подъезд ${entrance} этаж ${floor} ${corpus}, ${city} ${oblast}`,
                        representative: trustedPersonIin ?? "",
                      })
                      .then(() => {
                        handleNextStep();
                      });
                  }}
                >
                  Zhalgastyru
                </Button>
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
              <div className="tw-text-2xl tw-mb-4">Данные о заказе</div>
              <div className="tw-mb-4 tw-font-bold">
                Имя:
                <span className="tw-font-normal"> {name?.split(" ")[0]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Фамилия:
                <span className="tw-font-normal"> {name?.split(" ")[1]}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Отчество:
                <span className="tw-font-normal">{name?.split(" ")[2]}</span>
              </div>
            </div>
            <div
              className="tw-w-1/2 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-4 tw-p-4"
              style={{
                borderColor: "#6677F726",
              }}
            >
              <div className="tw-text-2xl tw-mb-4">Данные о заказе</div>
              <div className="tw-mb-4 tw-font-bold">
                Номер заказа:
                <span className="tw-font-normal"> {orderNumber}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Наименование услуги:
                <span className="tw-font-normal"> {serviceName}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Отделение: <span className="tw-font-normal">{CON}</span>
              </div>
            </div>
            <div className="tw-mt-8 tw-w-1/2 tw-border-solid tw-border-dark tw-border-2 tw-rounded-xl tw-p-4">
              <div className="tw-font-bold tw-text-4xl tw-pt-4 tw-pl-4">
                Окошко оплаты
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
                    <label>Card number</label>
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
                  <div className="tw-font-bold tw-text-center">
                    Метод оплаты
                  </div>
                  <div>VISA</div>
                </div>
              </div>
              <div className="tw-w-full tw-flex tw-justify-end">
                <Button
                  className="tw-mr-8 tw-bg-green tw-text-white"
                  onClick={() => {
                    setIsPaid(true);
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
                zhalgastyru
              </Button>
            </div>
          </div>
        )}
      </ConfigProvider>
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
          <div className="tw-font-bold tw-text-2xl"> Внимание!</div>
          <div>
            Документы выдаются только заявителю! В случае отсутствия заявителя
            требуется нотариальная доверенность на получение документов в
            оригинале!
          </div>
        </div>
      </Modal>
    </>
  );
};
