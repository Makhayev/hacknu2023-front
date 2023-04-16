import React, { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="tw-font-bold tw-text-4xl tw-text-center tw-mt-8">
        Сәлем, мен...
      </div>
      <div className="tw-flex tw-justify-around tw-mt-8">
        <Button
          className="tw-w-60 tw-h-20 tw-font-semibold tw-text-3xl"
          onClick={() => {
            navigate("/courier");
          }}
        >
          Жеткізушімін
        </Button>
        <Button
          className="tw-w-60 tw-h-20 tw-font-semibold tw-text-3xl"
          onClick={() => {
            navigate("/CON");
          }}
        >
          ХҚКО қызметкерімін
        </Button>
      </div>
    </div>
  );
};
