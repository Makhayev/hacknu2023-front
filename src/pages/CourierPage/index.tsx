import React, { ChangeEvent, FC, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  Modal,
  notification,
  Steps,
} from "antd";
import axios from "axios";
import moment from "moment/moment";
import AuthCode from "react-auth-code-input";

export const CourierPage: FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [courierData, setCourierData] = useState<{
    id: number;
    iin: string;
    companyId: number;
  }>();
  const [currentOrdermodalka, setCurrentOrdermodalka] = useState<any>({});
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [iin, setIin] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  return isAuthorized ? (
    <div>
      <h1 className="tw-text-center tw-mt-20 tw-font-bold">Барлық тапсырыс</h1>
      <ConfigProvider
        theme={{
          components: {
            Steps: {
              colorPrimary: "#0ACF83",
            },
          },
        }}
      >
        <div className="tw-w-full tw-flex tw-justify-center">
          <Steps
            progressDot={true}
            current={currentStep}
            className="tw-mt-10 tw-w-4/5 tw-cursor-pointer"
            labelPlacement="vertical"
            items={[
              {
                title: "Жаңа тапсырыстар",
                onClick: () => {
                  setCurrentStep(0);
                  axios
                    .get(`http://10.101.7.135:8081/couriers/${iin}`)
                    .then((res) => {
                      setCourierData(res.data);
                      axios
                        .get(
                          `http://10.101.7.135:8081/couriers/${res.data.id}/getAvailableOrders`
                        )
                        .then((res) => {
                          setAvailableOrders(res.data);
                          setIsAuthorized(true);
                        });
                    });
                },
              },
              {
                title: "Орындалудағы тапсырыстар",
                onClick: () => {
                  setCurrentStep(1);
                  axios
                    .get(
                      `http://10.101.7.135:8081/couriers/${courierData?.id}/getMyOrders`
                    )
                    .then((res) => {
                      console.log(res.data);
                      setAvailableOrders(res.data);
                    });
                },
              },
              {
                title: "Берілген тапсырыстар",
                onClick: () => {
                  setCurrentStep(2);
                  axios
                    .get(
                      `http://10.101.7.135:8081/couriers/${courierData?.id}/getCompletedOrders`
                    )
                    .then((res) => {
                      setAvailableOrders(res.data);
                    });
                },
              },
            ]}
          />
        </div>
      </ConfigProvider>
      <div className="tw-flex tw-flex-col tw-justify-start tw-items-center">
        {currentStep === 0
          ? availableOrders.map((order) => (
              <div
                className="tw-w-3/4 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-8 tw-p-4"
                style={{
                  borderColor: "#6677F726",
                }}
              >
                <div className="tw-flex tw-justify-between">
                  <div className="tw-font-bold tw-text-xl">
                    Тапсырыс нөмірі {order.requestId}
                  </div>
                  <Button
                    className="tw-bg-green tw-text-white"
                    onClick={() => {
                      axios
                        .put(
                          `http://10.101.7.135:8081/couriers/${courierData?.id}/claimOrder/${order.id}`
                        )
                        .then((res) => {
                          console.log(res);
                        });
                    }}
                  >
                    Тапсырысты қабылдау
                  </Button>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">Алушы:</span>
                  <span>{order.customerIIN}</span>
                </div>
                <div>
                  <span className="tw-font-bold">Қызмет:</span>
                  <span>{order.serviceType}</span>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">Уақыт:</span>
                  <span>
                    {moment(order.dateTimeReady).format("DD.MM.YYYY")}
                  </span>
                </div>
              </div>
            ))
          : currentStep === 1
          ? availableOrders.map((order) => (
              <div
                className="tw-w-3/4 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-8 tw-p-4"
                style={{
                  borderColor: "#6677F726",
                }}
              >
                <div className="tw-flex tw-justify-between">
                  <div className="tw-font-bold tw-text-xl">
                    Тапсырыс нөмірі {order.requestId}
                  </div>
                  <Button
                    className="tw-bg-green tw-text-white"
                    onClick={() => {
                      setOpen(true);
                      setCurrentOrdermodalka(order);
                    }}
                  >
                    Қолма қол тапсыру
                  </Button>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">Алушы:</span>
                  <span>{order.customerIIN}</span>
                </div>
                <div>
                  <span className="tw-font-bold">Қызмет:</span>
                  <span>{order.serviceType}</span>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">Уақыт:</span>
                  <span>
                    {moment(order.dateTimeReady).format("DD.MM.YYYY")}
                  </span>
                </div>
                <Modal
                  open={open}
                  footer={null}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  closable
                >
                  <div className="tw-flex tw-flex-col tw-items-center">
                    <div className="tw-font-bold tw-text-xl tw-my-4">
                      Заказ #{currentOrdermodalka?.requestId}
                    </div>
                    <div className="tw-my-4">
                      Тұтынушыда растау коды бар. Кодты енгізіңіз
                    </div>
                    <div className="tw-my-4">
                      <AuthCode
                        onChange={(value) => setCode(value)}
                        length={6}
                        inputClassName={
                          "tw-w-11 tw-h-11 tw-mr-4 tw-border-2 tw-text-center tw-border-green tw-rounded-md tw-focus-visible:outline-none"
                        }
                      />
                    </div>
                    <Button
                      className="tw-bg-green tw-text-white"
                      onClick={() => {
                        axios
                          .put(
                            `http://10.101.7.135:8081/couriers/${courierData?.id}/handOrder/${currentOrdermodalka.requestId}/${code}`
                          )
                          .then((res) => {
                            console.log(res.data);
                          });
                      }}
                    >
                      Растау
                    </Button>
                  </div>
                </Modal>
              </div>
            ))
          : availableOrders.map((order) => (
              <div
                className="tw-w-3/4 tw-border-solid tw-border-4 tw-rounded-2xl tw-mt-8 tw-p-4"
                style={{
                  borderColor: "#6677F726",
                }}
              >
                <div className="tw-flex tw-justify-between">
                  <div className="tw-font-bold tw-text-xl">
                    Тапсырыс нөмірі {order.requestId}
                  </div>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">Алушы:</span>
                  <span>{order.customerIIN}</span>
                </div>
                <div>
                  <span className="tw-font-bold">Қызмет:</span>
                  <span>{order.serviceType}</span>
                </div>
                <div className="tw-my-2">
                  <span className="tw-font-bold">уақыт:</span>
                  <span>
                    {moment(order.dateTimeReady).format("DD.MM.YYYY")}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  ) : (
    <div className="tw-flex tw-w-full tw-justify-center tw-items-center tw-h-full">
      <div className="tw-flex tw-flex-col tw-w-2/5 tw-justify-center tw-items-center">
        <h1 className="tw-font-bold tw-text-4xl">Жеткізушінің жеке кабинеті</h1>
        <div className="tw-w-full">Жалғастыру үшін ЖСН енгізіңіз</div>
        <Input
          value={iin}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setIin(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            axios
              .get(`http://10.101.7.135:8081/couriers/${iin}`)
              .then((res) => {
                setCourierData(res.data);
                axios
                  .get(
                    `http://10.101.7.135:8081/couriers/${res.data.id}/getAvailableOrders`
                  )
                  .then((res) => {
                    setAvailableOrders(res.data);
                    setIsAuthorized(true);
                  })
                  .catch(() => {
                    notification.error({ message: "Қате" });
                  });
              });
          }}
          className="tw-w-full tw-mt-4 tw-bg-green tw-text-white"
        >
          Кіру
        </Button>
      </div>
    </div>
  );
};
