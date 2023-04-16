import React, { FC, useEffect, useState } from "react";
import { Button, ConfigProvider, Modal, Steps } from "antd";
import axios from "axios";
import moment from "moment";
import AuthCode from "react-auth-code-input";

export const CONPage: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [currentOrderForModal, setCurrentOrderForModal] = useState<any>();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  useEffect(() => {
    if (currentStep === 0) {
      axios
        .get("http://10.101.7.135:8081/con/getDocumentsReady")
        .then((res) => {
          setOrders(res.data);
        });
    } else if (currentStep === 1) {
      axios
        .get("http://10.101.7.135:8081/con/getDocumentsCourierAssigned")
        .then((res) => {
          setOrders(res.data);
        });
    }
  }, [currentStep]);
  return (
    <div>
      <h1 className="tw-text-center tw-mt-20 tw-font-bold">
        Барлық тапсырыстар
      </h1>
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
                },
              },
              {
                title: "Қызмет үстінде",
                onClick: () => {
                  setCurrentStep(1);
                },
              },
            ]}
          />
        </div>
      </ConfigProvider>
      <div className="tw-flex tw-flex-col tw-justify-start tw-items-center">
        {currentStep === 0
          ? orders.map((order) => (
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
                        .post(
                          `http://10.101.7.135:8081/con/sendDocumentsReady/${order.id}`
                        )
                        .then((res) => {
                          console.log(res);
                        });
                    }}
                  >
                    {" "}
                    Жеткізуді ұсыну
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
          : orders.map((order) => (
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
                      setCurrentOrderForModal(order);
                      axios
                        .put(
                          `http://10.101.7.135:8081/con/approve/${order.id}/${order.courierId}`
                        )
                        .then((res) => {
                          console.log(res);
                        });
                    }}
                  >
                    Кодты растау
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
            ))}
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
            Заказ #{currentOrderForModal?.requestId}
          </div>
          <div className="tw-my-4">
            Жеткізушіге растау коды келді, оны енгізіңіз
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
              axios.put(
                `http://10.101.7.135:8081/con/sendOffCourier/${currentOrderForModal?.id}/${code}`
              );
            }}
          >
            Жіберу
          </Button>
        </div>
      </Modal>
    </div>
  );
};
