import { ChangeEvent, FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ConfigProvider, Input, Steps } from "antd";
import axios from "axios";

type OrderPageStates = "iinEnter" | "main";
export const OrderPage: FC = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<OrderPageStates>("iinEnter");
  const [iin, setIin] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [CON, setCON] = useState<string>("");
  const handleIinSubmit = () => {
    axios.get(`http://10.101.7.135:8081/getInfo/${id}/${iin}`).then((res) => {
      setName(
        `${res.data.FL.firstName} ${res.data.FL.lastName} ${res.data.FL.middleName}`
      );
      const response = res.data.DocumentStatus.data;
      setOrderNumber(response.requestId);
      setServiceName(response.serviceType.nameKz);
      setCON(response.organization.nameRu);
    });
    setCurrentStep((prev) => prev + 1);
    setState("main");
  };
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
            items={[
              {
                title: "Finished",
                description: "hey",
              },
              {
                title: "In Progress",
                description: "hey",
              },
              {
                title: "Waiting",
                description: "hey",
              },
              {
                title: "CRINGE",
                description: "hey",
              },
              {
                title: "CRINGE",
                description: "hey",
              },
            ]}
          />
        </div>
        {state === "iinEnter" ? (
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
                Номер заказа:
                <span className="tw-font-normal">{orderNumber}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Наименование услуги:
                <span className="tw-font-normal">{serviceName}</span>
              </div>
              <div className="tw-mb-4 tw-font-bold">
                Отделение: <span className="tw-font-normal">{CON}</span>
              </div>
            </div>
          </div>
        )}
      </ConfigProvider>
    </>
  );
};
